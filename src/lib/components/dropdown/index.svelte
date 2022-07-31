<script lang="ts">
    export let items: any;
    export let label: string;
    export let placeholder: string;
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    const selectItem = () => {
        dispatch("select", selectedItem);
    };
    let selectedItem = "";
</script>

<label
    for="countries"
    class=" m-auto w-1/3 block text-sm font-medium text-gray-300">{label}</label
>
<select
    bind:value={selectedItem}
    id="countries"
    class="m-auto text-sm rounded-md focus:border-blue-800 block w-1/3 p-2.5 shadow-md"
    on:change={selectItem}
>
    <option selected disabled value="">{placeholder}</option>

    {#each items as item}
        <option value={item.currency}
            ><img
                src={`https://flagcdn.com/24x18/${item.code.toLowerCase()}.png`}
                alt=""
            />{item.name}</option
        >
    {/each}
</select>
