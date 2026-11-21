import { createElement } from 'react';
import { collection, config, fields } from '@keystatic/core';
import { block, mark, wrapper } from '@keystatic/core/content-components';
import { messageSquareTextIcon } from '@keystar/ui/icon/icons/messageSquareTextIcon';
import { paintbrushIcon } from '@keystar/ui/icon/icons/paintbrushIcon';
import { panelTopIcon } from '@keystar/ui/icon/icons/panelTopIcon';
import { quoteIcon } from '@keystar/ui/icon/icons/quoteIcon';
import { splineIcon } from '@keystar/ui/icon/icons/splineIcon';
import { youtubeIcon } from '@keystar/ui/icon/icons/youtubeIcon';
import { Icon } from '@keystar/ui/icon';

export const postComponents = {
	Quotation: mark({
		label: '인용 (Quotation)',
		icon: createElement(Icon, { src: quoteIcon }),
		tag: 'em',
		schema: {
			type: fields.select({
				label: '종류',
				options: [
					{ label: '말 (speak)', value: 'speak' },
					{ label: '생각 (think)', value: 'think' }
				],
				defaultValue: 'speak'
			})
		}
	}),
	ImageComment: mark({
		label: '이미지 설명 (ImageComment)',
		icon: createElement(Icon, { src: messageSquareTextIcon }),
		tag: 'small',
		schema: {}
	}),
	Tabs: wrapper({
		label: '코드 탭 (Tabs)',
		description: '안에 넣은 코드 블록들이 탭으로 바뀌어요. 코드 첫 줄에 "// title 파일이름"을 쓰면 탭 이름이 돼요.',
		icon: createElement(Icon, { src: panelTopIcon }),
		schema: {}
	}),
	Canvas: block({
		label: '캔버스 데모 (Canvas)',
		icon: createElement(Icon, { src: paintbrushIcon }),
		schema: {}
	}),
	BezierCasteljau: block({
		label: '베지어 곡선 데모 (BezierCasteljau)',
		icon: createElement(Icon, { src: splineIcon }),
		schema: {}
	}),
	YouTube: block({
		label: '유튜브 영상 (YouTube)',
		icon: createElement(Icon, { src: youtubeIcon }),
		schema: {
			id: fields.text({
				label: '영상 ID',
				description: 'youtube.com/watch?v= 뒤의 값이에요.',
				validation: { length: { min: 1 } }
			})
		}
	}),
	EasingShowcase: block({
		label: '이징 데모 (EasingShowcase)',
		icon: createElement(Icon, { src: splineIcon }),
		schema: {}
	})
};

export const postContentOptions = {
	image: {
		directory: 'public/images/posts',
		publicPath: '/images/posts/'
	}
};

export default config({
	storage:
		process.env.NODE_ENV === 'development'
			? { kind: 'local' }
			: { kind: 'github', repo: { owner: 'movie42', name: 'hyunsu' } },
	ui: {
		brand: { name: '현수의 블로그' }
	},
	collections: {
		posts: collection({
			label: '글',
			path: 'src/content/markdown-pages/**',
			slugField: 'title',
			format: { contentField: 'content' },
			entryLayout: 'content',
			previewUrl: '/preview/{slug}',
			columns: ['title', 'date'],
			schema: {
				title: fields.slug({
					name: { label: '제목' },
					slug: { label: '주소', description: '폴더/파일이름 형식이에요. 예: react/my-post' }
				}),
				date: fields.date({ label: '날짜', validation: { isRequired: true } }),
				tags: fields.array(fields.text({ label: '태그' }), {
					label: '태그',
					description: 'etc 태그는 /posts/etc, movie 태그는 /posts/movie, 그 밖은 /posts/programming 으로 가요.',
					itemLabel: (props) => props.value
				}),
				description: fields.text({ label: '설명', multiline: true }),
				draft: fields.checkbox({
					label: '초안',
					description: '체크하면 블로그 목록·RSS·사이트맵에 나오지 않아요. 체크를 끄고 저장하면 공개돼요.',
					defaultValue: true
				}),
				content: fields.mdx({
					label: '본문',
					options: postContentOptions,
					components: postComponents
				})
			}
		})
	}
});
