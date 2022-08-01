<script lang="ts">
    export let options: any[] = [];
    export let optionLabel: string;
    export let optionKey: string;
    export let Inputlabel: string;
    export let placeholder: string;
    import { createEventDispatcher } from "svelte";
    interface Option {
        [key: string]: string;
    }
    let showOptions = false;
    let selectedItem: Option = { [optionKey]: "", [optionLabel]: "" };
    const dispatch = createEventDispatcher();
    $: searchedItems = () => {
        return options.filter((item: { [optionLabel: string]: string }) =>
            item[optionLabel]
                .toLowerCase()
                .includes(selectedItem[optionLabel].toLowerCase())
        );
    };

    const setShowOptions = (state: boolean) => {
        showOptions = state;
        if (!state) selectedItem = { [optionKey]: "", [optionLabel]: "" };
    };

    const selectItem = (item: Option) => {
        showOptions = false;
        if (item[optionKey] !== selectedItem[optionKey]) {
            dispatch("select", item[optionKey]);
        }
        selectedItem = { ...item };
    };

    const removeSelectedItem = () => {
        selectedItem = { [optionKey]: "", [optionLabel]: "" };
        dispatch("select", "");
    };
</script>

<label for="countries" class="w-1/3 block text-sm font-medium text-gray-300"
    >{Inputlabel}</label
>
<div
    class="mt-1 bg-blue-50 max-w-md max-h-12 rounded-md shadow-md p-2 flex items-center"
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 mr-2"
        viewBox="0 0 20 20"
        fill="gray"
    >
        <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
        />
    </svg>
    <input
        on:input={() => setShowOptions(true)}
        bind:value={selectedItem[optionLabel]}
        tabindex="0"
        class="w-full z-50 bg-inherit outline-none"
        {placeholder}
    />
    {#if selectedItem[optionKey]}
        <svg
            on:click={removeSelectedItem}
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="gray"
        >
            <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
            />
        </svg>
    {:else}
        <svg
            on:click|stopPropagation={() => setShowOptions(!showOptions)}
            class:rotate-180={showOptions}
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="gray"
        >
            <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
            />
        </svg>
    {/if}
</div>

<div class="relative">
    {#if showOptions && options.length}
        <div
            tabindex="0"
            class="absolute top-0 w-full z-50 bg-white border max-w-md mt-1 rounded-md shadow-md"
        >
            <ul class="py-1">
                {#each searchedItems() as item}
                    <li
                        on:click={() => selectItem(item)}
                        class="px-3 py-2 cursor-pointer hover:bg-gray-200 flex"
                    >
                        <img
                            class="rounded-full mr-2"
                            src={`https://flagcdn.com/24x18/${item.code.toLowerCase()}.png`}
                            alt=""
                        />
                        {item[optionLabel]}
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>
