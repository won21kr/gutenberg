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
				style={ { paddingLeft: `${ ( level - 1 ) * 16 }px` } }
				colSpan="3"
			>
				{ ( props ) => (
					<ButtonBlockAppender
						rootClientId={ parentBlockClientId }
						__experimentalSelectBlockOnInsert={ false }
						{ ...props }
					/>
				) }
			</TreeGridCell>
		</TreeGridRow>
	);
}
