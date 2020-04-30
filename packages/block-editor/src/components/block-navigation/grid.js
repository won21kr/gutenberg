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
import BlockNavigationBlockRow from './block-row';
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
		terminatedLevels = [],
		path = [],
	} = props;

	const isTreeRoot = ! parentBlockClientId;
	const filteredBlocks = compact( blocks );
	// Add +1 to the rowCount to take the block appender into account.
	const rowCount = showAppender
		? filteredBlocks.length + 1
		: filteredBlocks.length;
	const hasAppender =
		showAppender && filteredBlocks.length > 0 && ! isTreeRoot;
	const appenderPosition = rowCount;

	return (
		<>
			{ map( filteredBlocks, ( block, index ) => {
				const { clientId, innerBlocks } = block;
				const hasNestedBlocks =
					showNestedBlocks && !! innerBlocks && !! innerBlocks.length;
				const position = index + 1;
				const isLastRowAtLevel = rowCount === position;
				const updatedTerminatedLevels = isLastRowAtLevel
					? [ ...terminatedLevels, level ]
					: terminatedLevels;
				const updatedPath = [ ...path, position ];

				return (
					<Fragment key={ clientId }>
						<BlockNavigationBlockRow
							block={ block }
							onClick={ () => selectBlock( clientId ) }
							isSelected={ selectedBlockClientId === clientId }
							level={ level }
							position={ position }
							rowCount={ rowCount }
							showBlockMovers={ showBlockMovers }
							terminatedLevels={ terminatedLevels }
							path={ updatedPath }
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
								terminatedLevels={ updatedTerminatedLevels }
								path={ updatedPath }
							/>
						) }
					</Fragment>
				);
			} ) }
			{ hasAppender && (
				<BlockNavigationAppenderRow
					parentBlockClientId={ parentBlockClientId }
					position={ rowCount }
					rowCount={ appenderPosition }
					level={ level }
					terminatedLevels={ terminatedLevels }
					path={ [ ...path, appenderPosition ] }
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
export default function( props ) {
	return (
		<TreeGrid className="block-editor-block-navigation-grid">
			<BlockNavigationRows { ...props } />
		</TreeGrid>
	);
}
