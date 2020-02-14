/**
 * External dependencies
 */
import { times } from 'lodash';
import classnames from 'classnames';

const lineClassName = 'block-editor-block-navigator-descender-line';

export default function DescenderLines( {
	level,
	isLastRow,
	terminatedLevels,
} ) {
	return times( level - 1, ( index ) => {
		// Add 2, 1 because there's no descender for the first level, and
		// another 1 because levels start at 1, which indices start at 0.
		const currentLevel = index + 2;
		const hasItem = currentLevel === level;
		return (
			<div
				key={ index }
				className={ classnames( lineClassName, {
					'has-item': hasItem,
					'is-last-row': isLastRow,
					'is-terminated': terminatedLevels.includes( currentLevel ),
				} ) }
			/>
		);
	} );
}
