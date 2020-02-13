/**
 * External dependencies
 */
import { times } from 'lodash';
import classnames from 'classnames';

const lineClassName = 'block-editor-block-navigator-descender-line';

export default function DescenderLines( { level, isLastRow } ) {
	return times( level - 1, ( currentLevel ) => (
		<div
			key={ currentLevel }
			className={ classnames( lineClassName, {
				'has-item': currentLevel === level - 2,
				'is-last-row': isLastRow,
			} ) }
		/>
	) );
}
