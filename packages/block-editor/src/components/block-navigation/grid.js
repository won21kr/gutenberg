/**
 * External dependencies
 */
import { map, compact } from 'lodash';

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { __experimentalTreeGrid as TreeGrid } from '@wordpress/components';

/**
 * Internal dependencies
 */
import BlockNavigationRow from './row';
import BlockNavigationAppenderRow from './appender-row';

function BlockNavigationRows( props ) {
	const {
		blocks,
		selectBlock,
		selectedBlockClientId,
		showAppender,
		showBlockMovers,
		showNestedBlocks,
		parentBlockClientId,
		level = 1,
	} = props;

	const isTreeRoot = ! parentBlockClientId;
	const filteredBlocks = compact( blocks );
	// Add +1 to the siblingCount to take the block appender into account.
	const rowCount = filteredBlocks.length + 1;
	const hasAppender =
		showAppender && filteredBlocks.length > 0 && ! isTreeRoot;

	return (
		<>
			{ map( filteredBlocks, ( block, index ) => {
				const { clientId, innerBlocks } = block;
				const hasNestedBlocks =
					showNestedBlocks && !! innerBlocks && !! innerBlocks.length;

				return (
					<Fragment key={ clientId }>
						<BlockNavigationRow
							block={ block }
							onClick={ () => selectBlock( clientId ) }
							isSelected={ selectedBlockClientId === clientId }
							level={ level }
							position={ index + 1 }
							rowCount={ rowCount }
							showBlockMovers={ showBlockMovers }
						/>
						{ hasNestedBlocks && (
							<BlockNavigationRows
								blocks={ innerBlocks }
								selectedBlockClientId={ selectedBlockClientId }
								selectBlock={ selectBlock }
								showAppender={ showAppender }
								showBlockMovers={ showBlockMovers }
								showNestedBlocks={ showNestedBlocks }
								parentBlockClientId={ clientId }
								level={ level + 1 }
							/>
						) }
					</Fragment>
				);
			} ) }
			{ hasAppender && (
				<BlockNavigationAppenderRow
					parentBlockClientId={ parentBlockClientId }
					position={ rowCount }
					rowCount={ rowCount }
					level={ level }
				/>
			) }
		</>
	);
}

/**
 * Wrap `BlockNavigationRows` with `TreeGrid`. BlockNavigationRows is a
 * recursive component (it renders itself), so this ensures TreeGrid is only
 * present at the very top of the navigation grid.
 *
 * @param {Object} props
 */
export default function BlockNavigationGrid( props ) {
	return (
		<TreeGrid className="block-editor-block-navigation-grid">
			<BlockNavigationRows { ...props } />
		</TreeGrid>
	);
}
