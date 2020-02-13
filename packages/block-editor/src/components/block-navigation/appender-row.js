/**
 * WordPress dependencies
 */
import {
	__experimentalTreeGridRow as TreeGridRow,
	__experimentalTreeGridCell as TreeGridCell,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import ButtonBlockAppender from '../button-block-appender';
import DescenderLines from './descender-lines';

export default function BlockNavigationAppenderRow( {
	parentBlockClientId,
	position,
	level,
	rowCount,
} ) {
	return (
		<TreeGridRow
			className="block-editor-block-navigation-appender-row"
			level={ level }
			positionInSet={ position }
			setSize={ rowCount }
		>
			<TreeGridCell
				className="block-editor-block-navigation-appender-row__cell"
				colSpan="3"
			>
				{ ( props ) => (
					<div className="block-editor-block-navigation-appender-row__container">
						<DescenderLines
							level={ level }
							isLastRow={ position === rowCount }
						/>
						<ButtonBlockAppender
							rootClientId={ parentBlockClientId }
							__experimentalSelectBlockOnInsert={ false }
							{ ...props }
						/>
					</div>
				) }
			</TreeGridCell>
		</TreeGridRow>
	);
}
