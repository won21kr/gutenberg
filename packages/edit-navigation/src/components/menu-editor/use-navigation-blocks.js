/**
 * External dependencies
 */
import { isEqual, difference, find } from 'lodash';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useRef, useEffect } from '@wordpress/element';

function createBlockFromMenuItem( menuItem ) {
	return createBlock( 'core/navigation-link', {
		label: menuItem.title.raw,
		url: menuItem.url,
		id: menuItem.id,
	} );
}

function createMenuItemAttributesFromBlock( block ) {
	return {
		title: block.attributes.label,
		url: block.attributes.url,
	};
}

async function deleteMenuItems(
	menuItemEntity,
	deletedClientIds,
	currentBlocks
) {
	for ( const clientId of deletedClientIds ) {
		const itemToDelete = currentBlocks[ clientId ];
		await deleteMenuItem( menuItemEntity, itemToDelete.id );
	}
}

async function deleteMenuItem( entity, recordId ) {
	const path = `${ entity.baseURL + '/' + recordId + '?force=true' }`;
	const deletedRecord = await apiFetch( {
		path,
		method: 'DELETE',
	} );
	return deletedRecord.previous;
}

export default function useNavigationBlocks( menuId ) {
	const menuItems = useSelect(
		( select ) => select( 'core' ).getMenuItems( { menus: menuId } ),
		[ menuId ]
	);

	const entities = useSelect( ( select ) =>
		select( 'core' ).getEntitiesByKind( 'root' )
	);
	const menuItemEntity = find( entities, { kind: 'root', name: 'menuItem' } );

	const { saveMenuItem } = useDispatch( 'core' );

	const [ blocks, setBlocks ] = useState( [] );

	const menuItemsRef = useRef( {} );

	useEffect( () => {
		if ( ! menuItems ) {
			return;
		}

		menuItemsRef.current = {};

		const innerBlocks = [];

		for ( const menuItem of menuItems ) {
			const block = createBlockFromMenuItem( menuItem );
			menuItemsRef.current[ block.clientId ] = menuItem;
			innerBlocks.push( block );
		}

		setBlocks( [ createBlock( 'core/navigation', {}, innerBlocks ) ] );
	}, [ menuItems ] );

	const saveBlocks = () => {
		const { innerBlocks } = blocks[ 0 ];

		for ( const block of innerBlocks ) {
			const menuItem = menuItemsRef.current[ block.clientId ];

			if ( ! menuItem ) {
				saveMenuItem( {
					...createMenuItemAttributesFromBlock( block ),
					menus: menuId,
				} );
				continue;
			}

			if (
				! isEqual(
					block.attributes,
					createBlockFromMenuItem( menuItem ).attributes
				)
			) {
				saveMenuItem( {
					...menuItem,
					...createMenuItemAttributesFromBlock( block ),
					menus: menuId, // Gotta do this because REST API doesn't like receiving an array here. Maybe a bug in the REST API?
				} );
			}
		}

		const deletedClientIds = difference(
			Object.keys( menuItemsRef.current ),
			innerBlocks.map( ( block ) => block.clientId )
		);

		deleteMenuItems(
			menuItemEntity,
			deletedClientIds,
			menuItemsRef.current
		);
	};

	return [ blocks, setBlocks, saveBlocks ];
}
