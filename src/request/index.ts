
import { createAxiosByinterceptors } from '@/request/net' 
const axios = createAxiosByinterceptors({
    // baseURL: import.meta.env.VITE_BASE_URL,
    headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'usertest': import.meta.env.VITE_USERTEST,
        'appid': 10003,
        'appsecret': '667f8zCbxGMx186eTE5ux37tDfLZ2cKU2fNb/78eBdfatZE64F2XOpU',
    },
    timeout: 1 * 10 * 1000
})

export default axios