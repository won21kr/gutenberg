/**
 * WordPress dependencies
 */
import { __experimentalTreeGridCell as TreeGridCell } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BlockNavigationRow from './row';
import ButtonBlockAppender from '../button-block-appender';
import DescenderLines from './descender-lines';

export default function BlockNavigationAppenderRow( {
	parentBlockClientId,
	position,
	level,
	rowCount,
	terminatedLevels,
	path,
} ) {
	return (
		<BlockNavigationRow
			level={ level }
			position={ position }
			rowCount={ rowCount }
			path={ path }
		>
			<TreeGridCell
				className="block-editor-block-navigation-row__appender-cell"
				colSpan="3"
			>
				{ ( props ) => (
					<div className="block-editor-block-navigation-row__appender-container">
						<DescenderLines
							level={ level }
							isLastRow={ position === rowCount }
							terminatedLevels={ terminatedLevels }
						/>
						<ButtonBlockAppender
							rootClientId={ parentBlockClientId }
							__experimentalSelectBlockOnInsert={ false }
							{ ...props }
						/>
					</div>
				) }
			</TreeGridCell>
		</BlockNavigationRow>
	);
}
