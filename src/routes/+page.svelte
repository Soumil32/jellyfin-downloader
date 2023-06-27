<script lang="ts">
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

    $: console.log(uploadedFiles);
</script>

<form>
    <input type="file" bind:files={uploadedFiles} /> <br>
    <select bind:value={typeOfContent}>
        <option value="movie">Movie</option>
        <option value="tv">TV</option>
        <option value="music">Music</option>
    </select>
    <button type="submit">Upload</button>
</form>