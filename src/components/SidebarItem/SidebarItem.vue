<template>
  <li class="nav-item" :class="{ 'has-children': hasChildren, active: isActive }">
    <div
      class="nav-link"
      :class="[`level-${level}`, { open: isOpen }]"
      @click="onClickLink"
      role="button"
      :aria-expanded="hasChildren ? isOpen : undefined"
    >
      <div class="left-contents">
        <div class="nav-icon">
          <component :is="item.icon" class="h-6 w-6" />
        </div>

        <span class="nav-text">{{ item.title }}</span>
      </div>

      <div class="right-contents">
        <span v-if="item.dot" class="dot right-contents" aria-hidden="true"></span>
        <span v-if="item.badge" class="badge right-contents">{{ item.badge }}</span>
        <div v-if="hasChildren" class="chev right-contents" :class="{ rotated: isOpen }">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </div>
    </div>

    <transition name="slide" @enter="onEnter" @after-enter="onAfterEnter" @leave="onLeave">
      <ul v-if="hasChildren && isOpen" class="nav-children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.id"
          :item="child"
          :level="level + 1"
        />
      </ul>
    </transition>
  </li>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronRightIcon } from '@heroicons/vue/24/outline';
import SidebarItem from './SidebarItem.vue';

interface MenuItem {
  id: number;
  title: string;
  path?: string;
  icon?: any;
  children?: MenuItem[];
  badge?: string;
  dot?: boolean;
  active?: boolean;
}

const props = defineProps<{ item: MenuItem; level: number }>();
const route = useRoute();
const router = useRouter();

const isOpen = ref(Boolean(props.item.active || false));
const hasChildren = computed(
  () => Array.isArray(props.item.children) && props.item.children.length > 0,
);

// Determine active by path OR explicit active flag OR any child matches
const isActive = computed(() => {
  if (props.item.active) return true;
  if (props.item.path && route.path === props.item.path) return true;
  if (hasChildren.value) {
    return props.item.children!.some(
      (c) => c.path === route.path || c.id === (route.params as any).id,
    );
  }
  return false;
});

// click handler: 跳转或展开
const onClickLink = (e: MouseEvent) => {
  // prevent parent toggling when clicking child link area if it's a link route
  if (hasChildren.value) {
    isOpen.value = !isOpen.value;
    return;
  }
  if (props.item.path) {
    router.push(props.item.path).catch(() => {});
  }
};

// animation hooks for slide
const onEnter = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = '0';
  htmlEl.offsetHeight;
  htmlEl.style.height = htmlEl.scrollHeight + 'px';
};
const onAfterEnter = (el: Element) => {
  (el as HTMLElement).style.height = 'auto';
};
const onLeave = (el: Element) => {
  const htmlEl = el as HTMLElement;
  htmlEl.style.height = htmlEl.scrollHeight + 'px';
  htmlEl.offsetHeight;
  htmlEl.style.height = '0';
};
</script>

<style scoped>
.nav-item {
  list-style: none;
}

/* base link */
.nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition:
    background 0.18s ease,
    transform 0.12s ease;
  user-select: none;
}

/* left group (icon + text) */
.left-contents {
  display: flex;
  align-items: center;
  gap: 10px;
}
.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  opacity: 0.88;
}

/* text */
.nav-text {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

/* right area: dot / badge / chevron */
.right-contents {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* small red dot for unread */
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
}

/* numeric badge */
.badge {
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
  box-shadow: 0 6px 12px rgba(239, 68, 68, 0.12);
}

/* chevron */
.chev {
  transition: transform 0.22s ease;
  color: #6b7280;
  opacity: 0.9;
}
.chev.rotated {
  transform: rotate(90deg);
}

/* level indents */
.nav-link.level-0 .nav-text {
  margin-left: 0;
}
.nav-link.level-1 {
  padding-left: 34px;
}
.nav-link.level-2 {
  padding-left: 48px;
  font-size: 13px;
}

/* hover */
.nav-link:hover {
  background: rgba(99, 102, 241, 0.04);
  transform: translateY(0px);
}

/* active styling */
.nav-item.active > .nav-link {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.08), rgba(59, 130, 246, 0.06));
  box-shadow: inset 3px 0 0 linear-gradient(180deg, #60a5fa, #a78bfa);
  border-left: 3px solid transparent; /* placeholder to align */
}
.nav-item.active > .nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  border-radius: 4px 0 0 4px;
  background: linear-gradient(180deg, #60a5fa, #a78bfa);
}

/* children list */
.nav-children {
  list-style: none;
  margin: 6px 0 0 0;
  padding: 0 0 0 8px;
  overflow: hidden;
}

/* slide animation */
.slide-enter-active,
.slide-leave-active {
  transition: height 0.24s ease;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  height: 0;
}

/* small responsiveness */
@media (max-width: 900px) {
  .nav-text {
    font-size: 12px;
  }
  .badge {
    min-width: 20px;
    height: 20px;
    font-size: 11px;
  }
}
</style>
