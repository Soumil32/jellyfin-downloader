<script lang="ts">
    import { deserialize, enhance } from "$app/forms";
	import type { ActionResult } from "@sveltejs/kit";

    let uploadedFiles: FileList;
    let typeOfContent: 'movie' | 'tv' | 'music';
    let status: string = '';

    const upload = async () => {
        status = 'Uploading...';
        const fileReader = new FileReader();
        console.log(uploadedFiles);
        fileReader.readAsArrayBuffer(uploadedFiles[0]);
        fileReader.onload = async event => {
        console.log("File  read successfully");
        //@ts-ignore
        const content = event.target.result as ArrayBuffer;
        const CHUNK_SIZE = 5000;
        const chunkCount = Math.ceil(content.byteLength / CHUNK_SIZE);
        for (let i = 0; i < chunkCount; i++) {
            const chunk = content.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
            await fetch(`localhost:3000/upload?fileName=${uploadedFiles[0].name}`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/octet-stream',
                    'content-length': chunk.byteLength.toString(),
                },
                body: chunk
            });
        } 
        status = 'Uploaded';
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

<div class="flex h-screen justify-center">
    <form method="post" on:submit|preventDefault={upload} class="form-control lg:w-1/2 gap-5">
        <label for="files" class="label"><span class="label-text">Upload Files</span></label>
        <input name="files" type="file" bind:files={uploadedFiles} class="file-input file-input-bordered" /> <br>
        <label for="type" class="label"><span class="label-text">Type of Content</span></label>
        <select id="type" bind:value={typeOfContent} class="select select-bordered border-2">
            <option value="movie">Movie</option>
            <option value="tv">TV</option>
            <option value="music">Music</option>
        </select>
        <button type="submit" class="btn btn-bordered">Upload</button>
        <small>{status}</small>
    </form>
</div>