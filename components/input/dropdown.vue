<template>
    <div class="d-flex flex-column gap-1 text-field">
        <header-5><slot>&nbsp;</slot></header-5>

        <v-select v-model="selectionValue" outlined hide-details item-value="label" :dense="dense" :items="items" :menu-props="{ 'offset-y': true }">
            <template v-if="internalValue.icon" #prepend-inner>
                <v-icon color="tertiary" class="mr-2">{{ internalValue.icon }}</v-icon>
            </template>
            <template #selection="{ item }">
                <div :class="textClass" class="text--text">
                    <div :class="item.class">
                        {{ item.label }}
                    </div>
                </div>
            </template>
            <template #item="{ item }">
                <v-icon v-if="item.icon" color="tertiary" class="mr-3">{{ item.icon }}</v-icon>
                <div :class="textClass">{{ item.label }}</div>
            </template>
            <template #append>
                <div v-if="dense" class="background rounded-xl">
                    <v-icon color="black" size="20">{{ mdiChevronDown }}</v-icon>
                </div>
                <div v-else class="background rounded-xl">
                    <v-icon color="black" size="25">{{ mdiChevronDown }}</v-icon>
                </div>
            </template>
        </v-select>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { mdiChevronDown } from '@mdi/js';
import DropdownOption from './dropdownOption';

export default Vue.extend({
    props: {
        dense: {
            type: Boolean,
            default: false
        },
        items: {
            type: Array as PropType<DropdownOption[]>,
            default: (): DropdownOption[] => [
                { label: 'Travel', icon: 'mdi-airplane', class: '' },
                { label: 'Holiday', icon: 'mdi-home', class: '' }
            ]
        },
        value: {
            type: Object as PropType<DropdownOption | undefined>,
            default: (): DropdownOption | undefined => undefined
        }
    },
    data() {
        return {
            mdiChevronDown,

            selectionValue: this.value && this.value.label ? this.value.label : this.items[0].label,
            // selectionValue: this.items[0].label,
            internalValue: this.value ? this.value : this.items[0]
        };
    },
    computed: {
        textClass(): string {
            return this.dense ? 'f-16 w-400' : 'f-16 w-700';
        }
    },
    watch: {
        selectionValue(): void {
            this.internalValue = this.items.find((i) => i.label == this.selectionValue) as DropdownOption;
        },
        internalValue: {
            handler(): void {
                this.$emit('input', this.internalValue);
            },
            immediate: true
        }
    }
});
</script>

<style lang="scss" scoped>
::v-deep {
    .v-text-field.v-text-field--enclosed .v-text-field__details,
    .v-text-field.v-text-field--enclosed > .v-input__control > .v-input__slot {
        margin: 0;
        max-height: 40px;
        min-height: 40px !important;
        display: flex !important;
        align-items: center !important;
    }
    .v-input--dense.v-text-field.v-text-field--enclosed .v-text-field__details,
    .v-input--dense.v-text-field.v-text-field--enclosed > .v-input__control > .v-input__slot {
        max-height: 34px;
        min-height: 34px !important;
    }
    .v-list-item.v-list-item--link {
        padding-left: 12px !important;
    }
    input,
    .v-select__selection {
        color: var(--v-text-base) !important;
        font-weight: 700 !important;
    }
    .v-select.v-select--is-menu-active .v-input__append-inner .v-icon {
        transform: rotate(180deg) !important;
    }

    .v-input .v-input__slot .v-input__prepend-inner {
        margin-top: 8px !important;
    }
}
</style>
