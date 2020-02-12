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

export default function BlockNavigationAppenderRow( { parentBlockClientId } ) {
	return (
		<TreeGridRow className="block-editor-block-navigation-appender-row">
			<TreeGridCell>
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
