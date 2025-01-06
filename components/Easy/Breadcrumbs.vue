<script setup lang="ts">
type BreadcrumbLink = {
  to: string
  title: string
}

const breadcrumbs = computed(() => {
  const route = useRoute()

  const pathArray = route.path.split('/')
  pathArray.shift()
  const breadcrumbs = pathArray.reduce(
    (breadcrumbArray: BreadcrumbLink[], path: string, idx: number) => {
      breadcrumbArray.push({
        to: !!breadcrumbArray[idx - 1]
          ? breadcrumbArray[idx - 1].to + '/' + path
          : '/' + path,
        title: path.toString().replace('-', ' '),
      })
      return breadcrumbArray
    },
    [],
  )
  return breadcrumbs
})
</script>

<template>
  <nav class="easy-breadcrumbs-component">
    <ul class="easy-breadcrumbs">
      <li v-for="(breadcrumb, index) in breadcrumbs" :key="index">
        <NuxtLink :to="breadcrumb.to">{{ breadcrumb.title }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.easy-breadcrumbs {
  display: flex;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  color: var(--easy-color-gray-600);

  li {
    list-style: none;

    a {
      color: inherit;
      text-decoration: none;
      opacity: 0.7;

      &:hover {
        opacity: 1;
        text-decoration: underline;
        color: var(--primary-color);
      }
    }

    &:after {
      content: '>';
      margin: 0 0.5rem;
      opacity: 0.7;
    }

    &:last-child {
      pointer-events: none;

      &:after {
        content: '';
        margin: 0;
      }
    }
  }
}
</style>

<script lang="ts">
export default {
  name: 'EasyBreadcrumbs',
}
</script>
