/**
 * WordPress dependencies
 */
import { Button, Dropdown, ToolbarGroup } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { DOWN } from '@wordpress/keycodes';

/**
 * Internal dependencies
 */
import HeadingLevelIcon from './heading-level-icon';

const HEADING_LEVELS = [ 1, 2, 3, 4, 5, 6 ];

const POPOVER_PROPS = {
	className: 'block-editor-heading-level-toolbar',
	isAlternate: true,
};

/** @typedef {import('@wordpress/element').WPComponent} WPComponent */

/**
 * HeadingLevelDropdown props.
 *
 * @typedef WPHeadingLevelDropdownProps
 *
 * @property {number}                 selectedLevel The chosen heading level.
 * @property {(newValue:number)=>any} onChange      Callback to run when
 *                                                  toolbar value is changed.
 */

/**
 * Dropdown for selecting a heading level (1 through 6).
 *
 * @param {WPHeadingLevelDropdownProps} props Component props.
 *
 * @return {WPComponent} The toolbar.
 */
export default function HeadingLevelDropdown( { selectedLevel, onChange } ) {
	return (
		<Dropdown
			popoverProps={ POPOVER_PROPS }
			renderToggle={ ( { onToggle, isOpen } ) => {
				const openOnArrowDown = ( event ) => {
					if ( ! isOpen && event.keyCode === DOWN ) {
						event.preventDefault();
						event.stopPropagation();
						onToggle();
					}
				};

				return (
					<Button
						onClick={ onToggle }
						aria-haspopup="true"
						aria-expanded={ isOpen }
						aria-label={ __( 'Change heading level' ) }
						onKeyDown={ openOnArrowDown }
						showTooltip
						icon={ <HeadingLevelIcon level={ selectedLevel } /> }
					/>
				);
			} }
			renderContent={ () => (
				<ToolbarGroup
					isCollapsed={ false }
					controls={ HEADING_LEVELS.map( ( targetLevel ) => {
						const isActive = targetLevel === selectedLevel;
						return {
							icon: (
								<HeadingLevelIcon
									level={ targetLevel }
									isPressed={ isActive }
								/>
							),
							title: sprintf(
								// translators: %s: heading level e.g: "1", "2", "3"
								__( 'Heading %d' ),
								targetLevel
							),
							isActive,
							onClick() {
								onChange( targetLevel );
							},
						};
					} ) }
				/>
			) }
		></Dropdown>
	);
}
