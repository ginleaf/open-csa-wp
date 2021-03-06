var $j = jQuery.noConflict();	

$j(document).ready(function() {

	var table = $j("#open-csa-wp-showDeliveriesList_table");
	if (table.length > 0) {
		table.dataTable({
			"bPaginate": false, 
			"bStateSave": true, 
			"bInfo": false, 
			"bFilter": true,
			"bSort" : true
		});
	}


	var delivery_tips = $j("#open-csa-wp-newDelivery_div .open-csa-wp-tip_deliveries");
	
	if(delivery_tips.length > 0) {
		delivery_tips.cluetip({
			splitTitle: '|',						 
			showTitle: false,
			hoverClass: 'highlight',
			open: 'slideDown', 
			openSpeed: 'slow'
		});
	}

	delivery_tips = $j("#open-csa-wp-showDeliveriesList_div .open-csa-wp-tip_deliveries");
	
	if(delivery_tips.length > 0) {
		delivery_tips.cluetip({
			splitTitle: '|',						 
			showTitle: false,
			hoverClass: 'highlight',
			open: 'slideDown', 
			openSpeed: 'slow'
		});
	}
});

function open_csa_wp_new_delivery_format_custom_values (btn) {
	btn.disabled = true;

	var deadline_time_obj = document.getElementById("open-csa-wp-newDelivery_order_deadline_time_input_id");
	deadline_time_obj.value = deadline_time_obj.value.split(" ")[2] + ":00";
	
	var delivery_start_time_obj = document.getElementById("open-csa-wp-newDelivery_spotDetails_delivery_start_time_input_id");
	delivery_start_time_obj.value = delivery_start_time_obj.value.split(" ")[1] + ":00";
	
	var deliveryEndTimeObj = document.getElementById("open-csa-wp-newDelivery_spotDetails_delivery_end_time_input_id");
	deliveryEndTimeObj.value = deliveryEndTimeObj.value.split(" ")[1] + ":00";
	
	var $j = jQuery.noConflict();	
		
	$j(btn).closest("form").submit();
}

function open_csa_wp_request_initiate_new_or_update_delivery(btn, delivery_id, url_address) {

	var $j = jQuery.noConflict();

	document.getElementById("open-csa-wp-newDelivery_spotDetails_spotID_input_disabled_id").disabled = false;
	document.getElementById("open-csa-wp-newDelivery_delivery_deadline_date_disabled_id").disabled = false;
	document.getElementById("open-csa-wp-newDelivery_inCharge_input_disabled_id").disabled = false;
		
	var serialized_form_data = $j('#open-csa-wp-initiateNewDelivery_form_id').serializeArray();
	
	if (serialized_form_data[1].value == "") {
		open_csa_wp_you_forgot_this_one (document.getElementById("open-csa-wp-newDelivery_delivery_deadline_date_input_span_id"));
		event.preventDefault();
	}
	else {
		btn.disabled = true;

		var $j = jQuery.noConflict();
		serialized_form_data = JSON.stringify(serialized_form_data);
				
		var data = {
			'action': 'open-csa-wp-initiate_or_update_new_delivery_request',
			'delivery_id' : delivery_id,
			'data'	: serialized_form_data
		}
			
		$j.post(ajaxurl, data ,
			function(response){
				//console.log("Server returned: [" + response + "]");
				btn.disabled = false;
				window.location.replace(url_address);
		});
	}
}

function open_csa_wp_request_delete_deliver(delivery) {

	var $j = jQuery.noConflict();		
	var deliveryTR = $j(delivery).closest("tr");

	var delivery_id = $j(deliveryTR).attr("id").split('_')[1];
	
	var data = {
		"action" : "open-csa-wp-delete_delivery",
		"delivery_id" : delivery_id
	};
	
	$j.post(ajaxurl, data, 
		function(response) { 
			//console.log ("Server returned:["+response+"]");
			
			$j(deliveryTR).fadeOut(200,function() {
					$j(deliveryTR).remove();
					
					if ($j('#open-csa-wp-showDeliveriesList_table .open-csa-wp-showDeliveries-delivery').length == 0) {
						location.reload(true);
					}
			});
		}
	);
}

function open_csa_wp_edit_delivery(deliveryObj, page_url) {
	var deliveryTR = $j(deliveryObj).closest("tr");

	var delivery_id = $j(deliveryTR).attr("id").split('_')[1];

	window.location.replace( page_url + "&delivery_id=" + delivery_id);
}

function open_csa_wp_request_toggle_delivery_ability_to_order(image_obj, plugins_dir) {
	var $j = jQuery.noConflict();
	var row = image_obj.parentNode.parentNode;
	var delivery_id = row.id.split('_')[1];
	
	var are_orders_open = image_obj.title.split(" ")[0]=='remove'?0:1;
	
	//update database
	var data = {
		"action" : "open-csa-wp-update_delivery_abilityToOrder",
		"delivery_id" : delivery_id,
		"are_orders_open" : are_orders_open
	};
	
	
	$j.post(ajaxurl, data, 
		function(response) { 
			//console.log ("Server returned:["+response+"]");
			
			open_csa_wp_toggle_delivery_ability_to_order (delivery_id, plugins_dir);
		}
	);
}

function open_csa_wp_toggle_delivery_ability_to_order (delivery_id, plugins_dir) {

	obj_tr = document.getElementById ("open-csa-wp-showDeliveriesDeliveryID_"+delivery_id);
	image_obj = document.getElementById("open-csa-wp-showDeliveriesOpenOrdersIconID_"+delivery_id);;
	text_obj = document.getElementById("open-csa-wp-showDeliveriesOpenOrdersID_"+delivery_id);
	
	//toggle row color, image source, text, and title
	if (image_obj.title.split(" ")[0] == 'grant') {
		if (obj_tr.style.color != 'grey') {
			obj_tr.style.color = 'green';
		}
		image_obj.src = plugins_dir + "/open-csa-wp/icons/open.png";
		text_obj.innerHTML = deliveries_translation.yes;
		image_obj.title = deliveries_translation.remove_ability_to_order;
	} else {
		if (obj_tr.style.color != 'grey') {
			obj_tr.style.color = 'brown';
		}
		image_obj.src = plugins_dir + "/open-csa-wp/icons/close.png";
		text_obj.innerHTML = deliveries_translation.no;
		image_obj.title = deliveries_translation.grant_ability_to_order;
	}
}
