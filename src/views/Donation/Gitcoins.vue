<template>
    <div id="main" class="h-screen overflow-y-auto">
        <div class="m-auto pb-32 pt-8 px-4 max-w-screen-lg">
            <Header />
            <TransBarCard
                :title="rss3Profile.name ? rss3Profile.name + `'s Donations` : 'Donations'"
                :haveDetails="true"
                :haveContent="false"
                :haveContentInfo="false"
            >
                <template #header>
                    <i v-if="isOwner" class="bx bx-pencil bx-xs cursor-pointer" @click="toSetupGitcoins" />
                </template>
                <template #details>
                    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2" v-if="gitcoins.length !== 0">
                        <GitcoinCard
                            v-for="item in gitcoins"
                            :key="item.id"
                            :imageUrl="item.detail.grant.logo || undefinedImageAlt"
                            :timestamp="item.detail.txs.slice(-1)[0].timeStamp"
                            :username="rss3Profile.name"
                            :title="item.detail.grant.title || 'Inactive Project'"
                            :amount="item.detail.txs.slice(-1)[0]"
                            @click="toSingleGitcoin(item.id)"
                        />
                    </div>
                    <IntersectionObserverContainer
                        v-if="isHavingMoreAssets"
                        :once="false"
                        :enabled="!isLoadingAssets"
                        @trigger="loadMoreAssets"
                    >
                        <div class="flex gap-2 items-start justify-center">
                            <span class="font-light">One moment </span>
                            <LoadingSmile :size="18" :isLooping="true" />
                        </div>
                    </IntersectionObserverContainer>
                    <div
                        v-if="!isLoadingAssets && footprints.length === 0"
                        class="flex flex-row gap-2 items-end justify-center"
                    >
                        <span v-if="isOwner" class="font-light">Grab some collectibles to get a shot</span>
                        <span v-else class="font-light">
                            Looks like this user hasn't got a shot.<br />
                            Come back and check it out later
                        </span>
                        <Smile :size="18" class="mb-1" />
                    </div>
                </template>
            </TransBarCard>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Button from '@/components/Button/Button.vue';
import GitcoinCard from '@/components/Donation/GitcoinCard.vue';
import config from '@/config';
import RSS3 from '@/common/rss3';
import { DetailedDonation, GeneralAsset } from '@/common/types';
import { debounce } from 'lodash';
import utils from '@/common/utils';
import Header from '@/components/Common/Header.vue';
import { utils as RSS3Utils } from 'rss3';
import TransBarCard from '@/components/Card/TransBarCard.vue';
import IntersectionObserverContainer from '@/components/Common/IntersectionObserverContainer.vue';
import { formatter } from '@/common/address';
import Smile from '@/components/Icons/Smile.vue';
import LoadingSmile from '@/components/Loading/LoadingSmile.vue';

@Options({
    name: 'Gitcoins',
    components: {
        IntersectionObserverContainer,
        Button,
        GitcoinCard,
        Header,
        TransBarCard,
        Smile,
        LoadingSmile,
    },
})
export default class Gitcoins extends Vue {
    rns: string = '';
    ethAddress: string = '';
    grants: number = 0;
    contribs: number = 0;
    gitcoins: DetailedDonation[] = [];
    isOwner: boolean = false;
    rss3Profile: any = {};
    scrollTop: number = 0;
    lastRoute: string = '';
    assetList: GeneralAsset[] = [];
    assetsStartIndex: number = 0;
    isLoadingAssets: boolean = true;
    isHavingMoreAssets: boolean = true;
    $gtag: any;
    undefinedImageAlt: string = config.undefinedImageAlt;

    async mounted() {
        this.mountScrollEvent();
    }

    async initLoad() {
        this.lastRoute = this.$route.fullPath;
        this.gitcoins = [];

        const addrOrName = utils.getAddress(<string>this.$route.params.address);
        const pageOwner = await RSS3.setPageOwner(addrOrName);
        this.ethAddress = pageOwner.address;
        this.rns = pageOwner.name;
        this.isOwner = RSS3.isNowOwner();

        utils.subDomainModeRedirect(this.rns);

        this.rss3Profile = pageOwner.profile;

        if (!this.rss3Profile.name) {
            this.rss3Profile.name = formatter(this.ethAddress);
        }

        const { donations } = await utils.initAssets();
        this.assetList = donations;
        this.isLoadingAssets = false;
        await this.loadMoreAssets();
    }

    async loadMoreAssets() {
        if (!this.isLoadingAssets) {
            this.isLoadingAssets = true;
            let endIndex = this.assetsStartIndex + config.splitPageLimits.assets;
            if (endIndex >= this.assetList.length) {
                // Not having more assets
                endIndex = this.assetList.length;
                this.isHavingMoreAssets = false;
            }
            this.gitcoins = this.gitcoins.concat(
                await utils.loadAssets(this.assetList.slice(this.assetsStartIndex, endIndex)),
            );
            this.assetsStartIndex = endIndex;
            this.isLoadingAssets = false;
        }
    }

    toSetupGitcoins() {
        this.$router.push(`/setup/gitcoins`);
    }

    toGitcoin() {
        window.open(`https://gitcoin.co/`);
    }

    toSingleGitcoin(id: string) {
        const { platform, identity, type, uniqueID } = RSS3Utils.id.parseAsset(id);
        this.$gtag.event('visitSingleGitcoin', {
            userid: this.rns || this.ethAddress,
            platform,
            identity,
            uniqueID,
            type,
        });
        this.$router.push(
            (config.subDomain.isSubDomainMode ? '' : `/${this.rns || this.ethAddress}`) +
                `/singlegitcoin/${platform}/${identity}/${uniqueID}/${type}`,
        );
    }

    mountScrollEvent() {
        const el = document.getElementById('main');
        if (el) {
            el.addEventListener(
                'scroll',
                debounce((ev) => {
                    this.scrollTop = el.scrollTop;
                }, 100),
            );
        }
    }

    activated() {
        if (this.lastRoute === this.$route.fullPath) {
            const el = document.getElementById('main');
            if (el) {
                el.scrollTop = this.scrollTop;
            }
        } else {
            console.log('init load');
            this.initLoad();
        }
    }
}
</script>

<style></style>
