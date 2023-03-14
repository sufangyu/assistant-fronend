<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()

    const {
      params: { path },
      query
    } = route
    router.replace({ path: `/${path}`, query })
    return () => ''
  }
})
</script>
