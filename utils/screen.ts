export function isMobile(vuetify: any): boolean {
    const name = vuetify.breakpoint.name;
    return name == 'xs' || name == 'sm';
}