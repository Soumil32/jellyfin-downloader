<script lang="ts">
    import type { LayoutData } from './$types';
    import '../app.css'
    
    export let data: LayoutData;
</script>

<main>
    <slot></slot>
</main>