import axios from "axios";

const endpoints = {
    // Auth
    login: "/auth/token/",
    sms: "/auth/send_sms/",
    smsRecovery: "/auth/send_recovery_sms/",
    verifySms: "/auth/verify_sms/",
    register: "/auth/register/",
    token: "/auth/token/",
    refreshToken: "/auth/token/refresh/",
    authDelete: "/auth/delete/",
    changePassword: "/auth/recovery_password/",
    notificationToken: "/order/set_notification_token/",

    // Profile
    profile: "/courier/get/",
    aboutCreate: "/courier/about_create/",
    aboutGet: "/courier/about_get/",
    support: "/courier/support/",
    getShops: "/catalog/shops/",
    getRestaurants: "/catalog/restaurants/",
    updateAvatar: "/auth/avatar/update/",
    updateLang: "/auth/update_language/",

    // Shifts
    shifts: "/delivery/shifts/",
    shiftsAction: "/courier/shifts/action/",
    breakGet: "/courier/breaks/action/start/",
    breakStop: "/courier/breaks/action/stop/",

    // Orders
    orders: "/order/delivery_orders/",
    orderAction: "/courier/delivery_order/action/",
    orderFinish: "/courier/delivery_order/finish/",
    orderComplete: "/courier/delivery_order/completed/",

    // Reports
    reports: "/courier/report/history/",
    reportsInfo: "/courier/report/info/",
    reportsDetail: "/courier/report/history/detail/",

    //Chat
    chatToken: "order/chat/",
}

export const useHttp = () => {
    const config = useRuntimeConfig();

    let token = useCookie("access_token");
    let refresh = useCookie("refresh_token");
    let lang = useCookieLocale();
    const router = useRouter();

    let http = axios.create({
        baseURL: config.public.baseUrl // Production
    });

    http.defaults.headers.common["Accept-Language"] = lang.value;

    if (refresh.value && !useRoute().path.includes('/login')) {
        http.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;

        http.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;
                if (
                    error.response.status == 401 &&
                    originalRequest &&
                    !originalRequest._isRetry
                ) {
                    originalRequest._isRetry = true;
                    const data = { refresh: refresh.value };
                    await http
                        .post(endpoints.refreshToken, data)
                        .then(async (res) => {
                            token.value = res.data.access;
                            refresh.value = res.data.refresh;
                            router.go(0);
                        })
                        .catch((e) => {
                            useCookie("access_token").value = null;
                            useCookie("refresh_token").value = null;
                            console.error(`Unauthorized error from Http`, e);
                            router.go(0);
                        });
                }

                throw error;
            }
        );
    }
    // else {
        // refresh.value = null;
    // }
    // Auth
    async function register(data) {
        const res = await http.post(endpoints.register, data);
        return res;
    }
    async function getToken(data) {
        const res = await http.post(endpoints.token, data);
        return res.data;
    }
    async function setNotify(token, access_token) {
        const res = await http.post(endpoints.notificationToken, {'notification_token': token}, {headers: {'Authorization': `Bearer ${access_token}`}})
        return res.data;
    }
    async function getRefresh(data) {
        const res = await http.post(endpoints.refreshToken, data);
        return res.data;
    }
    async function getSms(data) {
        const res = await http.post(endpoints.token, data);
        return res.data;
    }
    async function sendCode(data) {
        const res = await http.post(endpoints.sms, data);
        return res.data;
    }
    async function sendRecoveryCode(data) {
        const res = await http.post(endpoints.smsRecovery, data);
        return res.data;
    }
    async function verifyCode(data) {
        const res = await http.post(endpoints.verifySms, data);
        return res.data;
    }
    async function deleteAuth() {
        const res = await http.delete(endpoints.authDelete);
        return res.data;
    }
    async function changePassword(data) {
        const res = await http.post(endpoints.changePassword, data);
        return res.data;
    }

    // Profile
    async function getProfile() {
        const res = await http.get(endpoints.profile);
        return res.data;
    }
    async function createAbout(data) {
        const res = await http.post(endpoints.aboutCreate, data);
        return res.data;
    }
    async function getAbout(data) {
        const res = await http.get(endpoints.aboutGet, data);
        return res.data;
    }
    async function support(data) {
        const res = await http.post(endpoints.support, data);
        return res.data;
    }
    async function getShops() {
        const res = await http.get(endpoints.getShops);
        return res.data;
    }
    async function getRestaurants() {
        const res = await http.get(endpoints.getRestaurants);
        return res.data;
    }
    async function updateAvatar(data) {
        const res = await http.patch(endpoints.updateAvatar, data);
        return res.data;
    }
    async function updateLang(data) {
        const res = await http.post(endpoints.updateLang, data);
        return res.data;
    }


    // Shifts
    async function getShifts() {
        const res = await http.get(endpoints.shifts);
        return res.data;
    }
    async function shiftsAction(data) {
        const res = await http.post(endpoints.shiftsAction, data);
        return res.data;
    }
    async function breakGet(data) {
        const res = await http.post(endpoints.breakGet, data);
        return res.data;
    }
    async function breakStop(data) {
        const res = await http.post(endpoints.breakStop, data);
        return res.data;
    }

    // Orders
    async function finishOrder(data) {
        const res = await http.post(endpoints.orderFinish, data);
        return res.data;
    }
    async function completeOrder(data) {
        const res = await http.post(endpoints.orderComplete, data);
        return res.data;
    }
    async function actionOrder(data) {
        const res = await http.post(endpoints.orderAction, data);
        return res.data;
    }

    // Reports
    async function getReports(filter) {
        let query = '';
        if (filter.dateFrom) {
            query += `?date_from=${filter.dateFrom}`;
        }
        if (filter.dateTo) {
            query += `&date_to=${filter.dateTo}`;
        }
        const res = await http.get(endpoints.reports + query);
        return res.data;
    }
    async function getReportsInfo(filter) {
        let query = '';
        if (filter.dateFrom) {
            query += `?date_from=${filter.dateFrom}`;
        }
        if (filter.dateTo) {
            query += `&date_to=${filter.dateTo}`;
        }
        const res = await http.get(endpoints.reportsInfo + query);
        return res.data;
    }
    async function getReportDetail(data) {
        const res = await http.post(endpoints.reportsDetail, data);
        return res.data;
    }

    //Chat
    async function getChatToken(data) {
        const res = await http.post(endpoints.chatToken, data);
        return res.data;
    }

    return {
        register,
        getToken,
        setNotify,
        getRefresh,
        getChatToken,
        sendCode,
        sendRecoveryCode,
        verifyCode,
        deleteAuth,
        getProfile,
        updateAvatar,
        updateLang,
        getShifts,
        shiftsAction,
        createAbout,
        getAbout,
        breakGet,
        breakStop,
        finishOrder,
        completeOrder,
        actionOrder,
        getShops,
        getRestaurants,
        support,
        getReports,
        getReportsInfo,
        getReportDetail,
        getSms,
        changePassword,
    };
};