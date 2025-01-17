import axios from 'axios';

import config from '@/config';

type TransactionStatus = 'pending' | 'passed' | 'failed' | 'bumped';

interface Response {
    errno?: number;
    errmsg?: string;
    data?: {
        tx_hash: string;
        tx_status: TransactionStatus;
    };
}

export default {
    mint: async (ethAddress: string, captchaToken: string) => {
        const res = await axios.post(
            `/poap/claim`,
            {
                address: ethAddress,
                reCaptcha: captchaToken,
            },
            {
                baseURL: config.poapActivity.endpoint,
            },
        );
        if (res.data) {
            return <Response>res.data;
        }
    },
};
