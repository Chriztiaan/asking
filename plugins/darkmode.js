export default function ({ $vuetify }) {
    $vuetify.theme.dark = localStorage.getItem('dark-mode') == 'true';
}
