/**
 * External dependencies
 */
import { animated } from 'react-spring/web.cjs';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	Button,
	__experimentalTreeGridRow as TreeGridRow,
	__experimentalTreeGridCell as TreeGridCell,
} from '@wordpress/components';
import {
	__experimentalGetBlockLabel as getBlockLabel,
	getBlockType,
} from '@wordpress/blocks';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import BlockIcon from '../block-icon';
import { MoveUpButton, MoveDownButton } from '../block-mover/mover-buttons';
import useMovingAnimation from '../use-moving-animation';
import DescenderLines from './descender-lines';

const AnimatedTreeGridRow = animated( TreeGridRow );

export default function BlockNavigationRow( {
	block,
	onClick,
	isSelected,
	position,
	level,
	rowCount,
	showBlockMovers,
} ) {
	const [ isHovered, setIsHovered ] = useState( false );
	const [ isFocused, setIsFocused ] = useState( false );
	const { name, clientId, attributes } = block;
	const blockType = getBlockType( name );
	const blockDisplayName = getBlockLabel( blockType, attributes );

	const wrapper = useRef( null );
	const adjustScrolling = false;
	const enableAnimation = true;
	const animateOnChange = position;
	const style = useMovingAnimation(
		wrapper,
		isSelected,
		adjustScrolling,
		enableAnimation,
		animateOnChange
	);

	// Subtract 1 from rowCount, as it includes the block appender.
	const hasSiblings = rowCount - 1 > 1;
	const hasRenderedMovers = showBlockMovers && hasSiblings;
	const hasVisibleMovers = isHovered || isSelected || isFocused;
	const moverCellClassName = classnames(
		'block-editor-block-navigation-row__mover-cell',
		{ 'is-visible': hasVisibleMovers }
	);

	return (
		<AnimatedTreeGridRow
			ref={ wrapper }
			style={ style }
			className={ classnames( 'block-editor-block-navigation-row', {
				'is-selected': isSelected,
			} ) }
			onMouseEnter={ () => setIsHovered( true ) }
			onMouseLeave={ () => setIsHovered( false ) }
			onFocus={ () => setIsFocused( true ) }
			onBlur={ () => setIsFocused( false ) }
			level={ level }
			positionInSet={ position }
			setSize={ rowCount }
		>
			<TreeGridCell
				className="block-editor-block-navigation-row__select-cell"
				colspan={ hasRenderedMovers ? undefined : 3 }
			>
				{ ( props ) => (
					<>
						<DescenderLines
							level={ level }
							isLastRow={ position === rowCount }
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
					</>
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
		</AnimatedTreeGridRow>
	);
}
