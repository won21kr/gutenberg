/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalTreeGridCell as TreeGridCell,
} from '@wordpress/components';
import {
	__experimentalGetBlockLabel as getBlockLabel,
	getBlockType,
} from '@wordpress/blocks';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BlockNavigationRow from './row';
import BlockIcon from '../block-icon';
import { MoveUpButton, MoveDownButton } from '../block-mover/mover-buttons';
import DescenderLines from './descender-lines';

export default function BlockNavigationBlockRow( {
	block,
	onClick,
	isSelected,
	position,
	level,
	rowCount,
	showBlockMovers,
	terminatedLevels,
	path,
} ) {
	const [ isHovered, setIsHovered ] = useState( false );
	const [ isFocused, setIsFocused ] = useState( false );
	const { name, clientId, attributes } = block;
	const blockType = getBlockType( name );
	const blockDisplayName = getBlockLabel( blockType, attributes );

	// Subtract 1 from rowCount, as it includes the block appender.
	const hasSiblings = rowCount - 1 > 1;
	const hasRenderedMovers = showBlockMovers && hasSiblings;
	const hasVisibleMovers = isHovered || isSelected || isFocused;
	const moverCellClassName = classnames(
		'block-editor-block-navigation-row__mover-cell',
		{ 'is-visible': hasVisibleMovers }
	);

	return (
		<BlockNavigationRow
			className={ classnames( {
				'is-selected': isSelected,
			} ) }
			onMouseEnter={ () => setIsHovered( true ) }
			onMouseLeave={ () => setIsHovered( false ) }
			onFocus={ () => setIsFocused( true ) }
			onBlur={ () => setIsFocused( false ) }
			level={ level }
			position={ position }
			rowCount={ rowCount }
			path={ path }
		>
			<TreeGridCell
				className="block-editor-block-navigation-row__select-cell"
				colspan={ hasRenderedMovers ? undefined : 3 }
			>
				{ ( props ) => (
					<div className="block-editor-block-navigation-row__select-container">
						<DescenderLines
							level={ level }
							isLastRow={ position === rowCount }
							terminatedLevels={ terminatedLevels }
						/>
						<Button
							className="block-editor-block-navigation-row__select-button"
							onClick={ onClick }
							{ ...props }
						>
							<BlockIcon icon={ blockType.icon } showColors />
							{ blockDisplayName }
							{ isSelected && (
								<span className="screen-reader-text">
									{ __( '(selected block)' ) }
								</span>
							) }
						</Button>
					</div>
				) }
			</TreeGridCell>
			{ hasRenderedMovers && (
				<>
					<TreeGridCell className={ moverCellClassName }>
						{ ( props ) => (
							<MoveUpButton
								__experimentalOrientation="vertical"
								clientIds={ [ clientId ] }
								{ ...props }
							/>
						) }
					</TreeGridCell>
					<TreeGridCell className={ moverCellClassName }>
						{ ( props ) => (
							<MoveDownButton
								__experimentalOrientation="vertical"
								clientIds={ [ clientId ] }
								{ ...props }
							/>
						) }
					</TreeGridCell>
				</>
			) }
		</BlockNavigationRow>
	);
}
