import React from 'dom-chef';
import elementReady from 'element-ready';

import features from '.';
import {wrapAll} from '../helpers/dom-utils';

async function init(): Promise<void | false> {
	const [, currentFeature] = /features\/([^.]+)/.exec(location.pathname)!;
	const feature = features.meta.find(feature => feature.id === currentFeature);
	if (!feature) {
		return false;
	}

	const conversationsUrl = '/sindresorhus/refined-github/issues?q=' + encodeURIComponent(`"${feature.id}" sort:updated-desc`);

	const commitInfoBox = (await elementReady('.hx_commit-tease, include-fragment.commit-loader'))!.parentElement!;
	commitInfoBox.classList.add('width-fit', 'min-width-0', 'flex-auto', 'mb-lg-0', 'mr-lg-3');
	commitInfoBox.classList.remove('flex-shrink-0');

	const featureInfoBox = (
		<div className="Box rgh-feature-description" style={{flex: '0 1 544px'}}>
			<div className="Box-row d-flex height-full">
				{feature.screenshot && (
					<a href={feature.screenshot} className="flex-self-center">
						<img
							src={feature.screenshot}
							className="d-block border"
							style={{
								maxHeight: 100,
								maxWidth: 150,
							}}/>
					</a>
				)}
				<div className={'flex-auto' + (feature.screenshot ? ' ml-3' : '')}>
					{ /* eslint-disable-next-line react/no-danger */ }
					<div dangerouslySetInnerHTML={{__html: feature.description}} className="text-bold"/>
					<div className="no-wrap">
						<a href={conversationsUrl} data-pjax="#repo-content-pjax-container">Conversations</a>
					</div>
				</div>
			</div>
		</div>
	);

	wrapAll([commitInfoBox, featureInfoBox], <div className="d-lg-flex"/>);
}

void features.add(__filebasename, {
	include: [
		() => /refined-github\/blob\/.+?\/source\/features\/[\w.-]+$/.test(location.pathname),
	],
	awaitDomReady: false,
	deduplicate: '.rgh-feature-description', // #3945
	init,
});
