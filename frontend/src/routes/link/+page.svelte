<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
    export let form;

    let typeOfContent: 'movie' | 'tv' | 'music';
    let link: string;
</script>

<div class="flex justify-center items-center h-screen">
    <form method="post" class="flex gap-5 form-control lg:w-1/2">
        <label for="link" class="label"><span class="label-text">Movie Link</span></label>
        <input id="link" name="link" type="text" bind:value={link} class="input input-bordered border"/> <br>
        <label for="type" class="label"><span class="label-text">Type of Content</span></label>
        <select id="type" name="type" bind:value={typeOfContent} class="select">
            <option value="movie">Movie</option>
            <option value="tv">TV</option>
            <option value="music">Music</option>
        </select>
        <button type="submit" class="btn">Submit</button>
        <br>
        {form ?? ''}
    </form>
</div>
