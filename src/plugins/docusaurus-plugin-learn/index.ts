import type { LoadContext, Plugin } from '@docusaurus/types'
import { course } from '../../learn/course'

export default function pluginLearn(context: LoadContext): Plugin {
  const learnPath = `${context.baseUrl.replace(/\/$/, '')}/learn`
  return {
    name: 'docusaurus-plugin-learn',
    async contentLoaded({ actions }) {
      const { addRoute } = actions

      addRoute({
        path: learnPath,
        component: '@site/src/learn/pages/LearnLandingPage',
        exact: true,
      })

      for (const lesson of course.lessons) {
        if (lesson.status !== 'published') continue
        addRoute({
          path: `${learnPath}/${lesson.slug}`,
          component: '@site/src/learn/pages/LessonPage',
          exact: true,
        })
      }
    },
  }
}
