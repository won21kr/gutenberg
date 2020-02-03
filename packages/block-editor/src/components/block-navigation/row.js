/**
 * External dependencies
 */
import { animated } from 'react-spring/web.cjs';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import {
	__experimentalGetBlockLabel as getBlockLabel,
	getBlockType,
} from '@wordpress/blocks';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TreeGridRow, TreeGridCell } from '../tree-grid';
import BlockIcon from '../block-icon';
import { MoveUpButton, MoveDownButton } from '../block-mover/mover-buttons';
import useMovingAnimation from '../use-moving-animation';

const AnimatedTreeGridRow = animated( TreeGridRow );

export default function BlockNavigationRow( { block, onClick, isSelected, position, level, siblingCount, showBlockMovers } ) {
	const [ isHovered, setIsHovered ] = useState( false );
	const [ isFocused, setIsFocused ] = useState( false );
	const {
		name,
		clientId,
		attributes,
	} = block;
	const blockType = getBlockType( name );
	const blockDisplayName = getBlockLabel( blockType, attributes );

	const wrapper = useRef( null );
	const adjustScrolling = false;
	const enableAnimation = true;
	const animateOnChange = position;
	const style = useMovingAnimation( wrapper, isSelected, adjustScrolling, enableAnimation, animateOnChange );

	const hasSiblings = siblingCount > 1;
	const hasVisibleMovers = isHovered || isSelected || isFocused;
	const moverClassName = classnames( 'block-editor-block-navigation-row__mover-button', { 'is-visible': hasVisibleMovers } );

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
			setSize={ siblingCount }
		>
			<TreeGridCell>
				{ ( props ) => (
					<Button
						className="block-editor-block-navigation-row__select-button"
						onClick={ onClick }
						{ ...props }
					>
						<BlockIcon icon={ blockType.icon } showColors />
						{ blockDisplayName }
						{ isSelected && <span className="screen-reader-text">{ __( '(selected block)' ) }</span> }
					</Button>
				) }
			</TreeGridCell>
			{ showBlockMovers && hasSiblings && (
				<>
					<TreeGridCell>
						{ ( props ) => (
							<MoveUpButton
								__experimentalOrientation="vertical"
								clientIds={ [ clientId ] }
								className={ moverClassName }
								{ ...props }
							/>
						) }
					</TreeGridCell>
					<TreeGridCell>
						{ ( props ) => (
							<MoveDownButton
								__experimentalOrientation="vertical"
								clientIds={ [ clientId ] }
								className={ moverClassName }
								{ ...props }
							/>
						) }
					</TreeGridCell>
				</>
			) }
		</AnimatedTreeGridRow>
	);
}
