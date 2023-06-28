<script lang="ts">
    import { deserialize, enhance } from "$app/forms";
	import type { ActionResult } from "@sveltejs/kit";

    let uploadedFiles: any;
    let typeOfContent: 'movie' | 'tv' | 'music';

    const upload = async () => {
        const formData = new FormData();
        formData.append('files', uploadedFiles);
        formData.append('type', typeOfContent);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log(data);
    }

    async function handleSubmit(event: Event) {
        console.log({this: this});

        console.log(this[0].files)
        const files = this[0].files
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(file);
            data.append('files', file);
        }
        data.append('type', typeOfContent);

        const response = await fetch(this.action, {
            method: 'POST',
            body: data
        });

        const result: ActionResult = deserialize(await response.text());
    }

</script>

<form method="post" on:submit|preventDefault={handleSubmit}>
    <input name="files" type="file" bind:files={uploadedFiles} /> <br>
    <select bind:value={typeOfContent}>
        <option value="movie">Movie</option>
        <option value="tv">TV</option>
        <option value="music">Music</option>
    </select>
    <button type="submit">Upload</button>
</form>