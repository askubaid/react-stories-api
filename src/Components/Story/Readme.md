`Story` Example:

```js
import YouTubeMoment from '../Moment/YouTube';
import WikidataMoment from '../Moment/Wikidata';
import WikipediaMoment from '../Moment/Wikipedia';

<Story label="React Story" description="One of the Most Popular Component-Driven Frontend Frameworks" logo={<img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"/>} image="https://upload.wikimedia.org/wikipedia/commons/e/ef/Daphne_Lantier_console_screenshot.png">
  <WikipediaMoment title="Wikipedia Article" label="Wikipedia Article" url="https://en.m.wikipedia.org/wiki/React_(web_framework)" subtitle="Learn About the History of React.js" color={{background:'#f5d9c6', text:'#78563e'}} index={0} />
  <YouTubeMoment title="Crash Course" label="YouTube Video" subtitle="Watch this Intro Course" video_id="MhkGQAoc7bc" color={{background:'#60dbfc', text:'#1f1c1c'}} index={1} />
  <WikidataMoment entity_id="Q19399674" color={{background:'#cc7fa9', text:'#36031f'}} label="Wikidata" index={2} />
</Story>
```