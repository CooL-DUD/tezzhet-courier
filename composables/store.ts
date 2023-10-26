export const useAbout = () => useState<object>('about', () => {
    return {
        about: "",
        dream: "",
        start_date: "",
        end_date: "",
        money: null
    }
})
export const useError = () => useState<object>('error', () => {
    return {
        error: ""
    }
})