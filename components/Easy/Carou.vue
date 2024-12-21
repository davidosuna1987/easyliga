<script setup lang="ts">
import { CSSProperties } from 'vue'

const activeIndex = ref(0) // Índice actual
const containerHeight = ref<number>(0)

// Computed para índices previos y siguientes
const prevIndex = computed(() =>
  activeIndex.value === 0 ? slides.value.length - 1 : activeIndex.value - 1,
)
const nextIndex = computed(() =>
  activeIndex.value === slides.value.length - 1 ? 0 : activeIndex.value + 1,
)

// Ref para capturar nodos hijos
const slides = ref<VNode[]>([])

// Métodos de navegación
const prev = (): void => {
  activeIndex.value =
    activeIndex.value === 0 ? slides.value.length - 1 : activeIndex.value - 1
}

const next = (): void => {
  activeIndex.value =
    activeIndex.value === slides.value.length - 1 ? 0 : activeIndex.value + 1
}

// Estilos dinámicos para las slides
const getSlideStyle = (index: number): CSSProperties => {
  if (index === activeIndex.value) {
    return {
      transform: 'translateX(0) scale(1)',
      zIndex: '3',
    }
  }
  if (index === prevIndex.value) {
    return {
      transform: 'translateX(-100%) scale(0.8)',
      zIndex: '2',
    }
  }
  if (index === nextIndex.value) {
    return {
      transform: 'translateX(100%) scale(0.8)',
      zIndex: '2',
    }
  }
  return {
    transform: 'translateX(200%)',
    zIndex: '1',
  }
}

// Usa `getCurrentInstance` para capturar los hijos del slot
const instance = getCurrentInstance()

watchEffect(() => {
  // Captura todos los hijos pasados al slot del componente
  if (instance?.slots.default) {
    slides.value = instance.slots.default()?.map(node => node) || []
  }

  // Calcula la altura del contenedor
  setTimeout(() => {
    const $slides = document.querySelectorAll('.carousel__slide > *')
    $slides.forEach(slide => {
      if (containerHeight.value < slide.clientHeight) {
        containerHeight.value = slide.clientHeight
      }
    })
  }, 0)
})
</script>

<template>
  <div class="carousel">
    <div
      class="carousel__container"
      :style="{ height: `${containerHeight}px` }"
    >
      <!-- Renderiza los hijos directamente -->
      <div
        v-for="(child, index) in slides"
        :key="index"
        :class="[
          'carousel__slide',
          { 'is-active': index === activeIndex },
          { 'is-prev': index === prevIndex },
          { 'is-next': index === nextIndex },
        ]"
        :style="getSlideStyle(index)"
      >
        <!-- Renderiza cada nodo (componente o HTML) -->
        <slot :name="`slide-${index}`" />
        <component :is="child" />
      </div>
    </div>
    <button class="carousel__control prev" @click="prev">‹</button>
    <button class="carousel__control next" @click="next">›</button>
  </div>
</template>

<style scoped>
.carousel {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: auto;
}

.carousel__container {
  display: flex;
  position: relative;
  transition: transform 0.3s ease-in-out;
}

.carousel__slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease-in-out, z-index 0.3s ease-in-out;
  transform-origin: center;
}

.carousel__control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
}
.carousel__control.prev {
  left: 1rem;
}
.carousel__control.next {
  right: 1rem;
}
</style>
