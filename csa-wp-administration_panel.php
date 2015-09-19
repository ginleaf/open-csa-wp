<?php
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

/*	********************************
	CREATION OF ADMINISTRATION PANEL
	********************************	
*/

if ( is_admin() ){ // admin actions
	add_action( 'admin_menu', 'CsaWpPluginMenu' );
	add_action( 'admin_init', 'RegisterCSASettings' );
}


function CsaWpPluginMenu() {
	$parent_slug = 'csa_management';
	add_menu_page( 'CSA Management', 'CSA', 'manage_options', $parent_slug );
	add_submenu_page( $parent_slug, 'CSA Settings', 'Settings', 'manage_options', $parent_slug, 'CsaWpPluginSettingsMenu');
	add_submenu_page( $parent_slug, 'Manage CSA Users', 'Users', 'manage_options', 'csa_users_management', 'CsaWpPluginUsersMenu');
	add_submenu_page( $parent_slug, 'Manage CSA Products', 'Products', 'manage_options', 'csa_products_management', 'CsaWpPluginProductsMenu');
	add_submenu_page( $parent_slug, 'Manage CSA Orders', 'Orders', 'manage_options', 'csa_orders_management', 'CsaWpPluginOrdersMenu');		
}

function CsaWpPluginSettingsMenu() {
	global $wpdb;

	if ( !current_user_can( 'administrator' ) &&
		(!($csaData = get_user_meta( $user->ID, 'csa-wp-plugin_user', true )) || $csaData['role'] != "administrator" )
	)	wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	
	echo '<div class="wrap">';
	echo '<h2>CSA Management Panel</h2>';

	echo '<h2>Settings</h2>';
	echo '<form method="post" action="options.php">';
	settings_fields(csaOptionsGroup);
	do_settings_sections(csaOptionsGroup);
	
	echo '
		<table class="form-table">
		<tr valign="top">
        <th scope="row">Delivery day</th>
        <td><input type="text" name="csa_delivery_day" value="'.get_option('csa_delivery_day').'" /></td>
        </tr>
         
		<tr valign="top">
        <th scope="row">Last delivery date</th>
        <td><input type="date" name="csa_last_delivery_date" value="'.get_option('csa_last_delivery_date').'" /></td>
        </tr>
		
        </table>';
	
	submit_button();

	echo '</form>';	
	echo '</div>';
}

function CsaWpPluginUsersMenu() {
	if ( !current_user_can( 'administrator' ) &&
		(!($csaData = get_user_meta( $user->ID, 'csa-wp-plugin_user', true )) || $csaData['role'] != "administrator" )
	)	wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
	?>
	<script>
	window.location.replace("<?php echo admin_url("/users.php"); ?>");
	</script>
<?php
}

function CsaWpPluginProductsMenu() {
	if ( !current_user_can( 'administrator' ) &&
		(!($csaData = get_user_meta( $user->ID, 'csa-wp-plugin_user', true )) || $csaData['role'] != "administrator" )
	)	wp_die( __( 'You do not have sufficient permissions to access this page.' ) );

	echo '<div class="wrap">';
	echo '<h2>CSA Management Panel</h2>';

	CsaWpPluginShowNewProductForm();
	
	CsaWpPluginShowProducts();
	
	echo '</div>';
}

function CsaWpPluginOrdersMenu() {
	if ( !current_user_can( 'administrator' ) &&
		(!($csaData = get_user_meta( $user->ID, 'csa-wp-plugin_user', true )) || $csaData['role'] != "administrator" )
	)	wp_die( __( 'You do not have sufficient permissions to access this page.' ) );

	echo '<div class="wrap">';
	echo "<h2>CSA Management Panel</h2>";

	CsaWpPluginUserOrder();
	
	echo '</div>';
}

function RegisterCSASettings() {
	register_setting(csaOptionsGroup, 'csa_delivery_day');
	register_setting(csaOptionsGroup, 'csa_last_delivery_date');  
	register_setting(csaOptionsGroup, 'csa_consumer_fee_percentage');
	register_setting(csaOptionsGroup, 'csa_producer_fee_percentage');  
	register_setting(csaOptionsGroup, 'csa_wp_plugin_db_version');  
}

function UnRegisterCSASettings() {
	unregister_setting(csaOptionsGroup, 'csa_delivery_day' );
	delete_option('csa_delivery_day');
	unregister_setting(csaOptionsGroup, 'csa_last_delivery_date' );
	delete_option('csa_last_delivery_date');  
	unregister_setting(csaOptionsGroup, 'csa_consumer_fee_percentage');
	delete_option('csa_consumer_fee_percentage');  
	unregister_setting(csaOptionsGroup, 'csa_producer_fee_percentage');  
	delete_option('csa_producer_fee_percentage');  
	unregister_setting(csaOptionsGroup, 'csa_wp_plugin_db_version');  
	delete_option('csa_wp_plugin_db_version');  
}
?>