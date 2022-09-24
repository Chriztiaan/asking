export default class DropdownOption {
    label = '';
    icon = '';
    class = '';

    constructor(label = '', icon = '', style = '') {
        this.label = label;
        this.icon = icon;
        this.class = style;
    }
}
