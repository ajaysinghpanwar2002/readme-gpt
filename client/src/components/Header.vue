<template>
    <header>
        <div>
            <nav>
                <RouterLink to="/">Home</RouterLink>
            </nav>
        </div>
    </header>
</template>

<script>
import { RouterLink } from 'vue-router'
export default{
    name: 'Header',
}
</script>