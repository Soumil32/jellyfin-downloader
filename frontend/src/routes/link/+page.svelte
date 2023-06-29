<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    export let form;

    let typeOfContent: 'movie' | 'tv' | 'music';
    let link: string;
</script>

<form method="post">
    <input name="link" type="text" bind:value={link} /> <br>
    <select name="type" bind:value={typeOfContent}>
        <option value="movie">Movie</option>
        <option value="tv">TV</option>
        <option value="music">Music</option>
    </select>
    <button type="submit">Submit</button>
    <br>
    {form ?? ''}
</form>
