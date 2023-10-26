export default defineNuxtRouteMiddleware((to, from) => {
    const about = useAbout()
    if (to.fullPath === '/profile/about' && from.fullPath === '/profile/about/edit' && about.value.about === "") {
        return navigateTo('/profile')
    }
})