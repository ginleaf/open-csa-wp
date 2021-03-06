
var $j = jQuery.noConflict();

$j(document).ready(function() {
	var products_list_table = $j("#open-csa-wp-showProductsList_table");
	if (products_list_table.length > 0) {
		var o_table = products_list_table.dataTable({
			"bPaginate": false, 
			"bStateSave": true, 
			"bInfo": false, 
			"bFilter": true
		});

		var data_editable = {
			"width" : "10em",
			"height": "3em",
			"type" : "text",
			//"submit" : "<img src='" + "<?php echo plugins_url(); ?>" + "/open-csa-wp/icons/ok.png'>",
			//"cancel" : "<img src='" + "<?php echo plugins_url(); ?>" + "/open-csa-wp/icons/cancel.png'>",
			"tooltip": products_translation.tooltip,
			"placeholder": products_translation.placeholder,
			"onblur": "cancel",
			"loadtype": 'POST',
		};
		
		//edit any value of any object (of class .editable)
		$j(".editable", o_table.fnGetNodes()).editable(
			function(value, settings) { 
				var tmp = this;

				var data_post = {
					"action" : "open-csa-wp-update_product",
					"value" : value,
					"product_id": this.parentNode.getAttribute("id").split('_')[1],
					"column": o_table.fnGetPosition(this)[2]			//???? why [2] and not [1]? - [0] describes the row, [1] describes the column, [2] describes again the column?, [3..] undefined
				};
				$j.post(ajaxurl, data_post, 
					function(response) { 
						//console.log ("Server returned:["+response+"]");
						
						//var fetch = response.split(",");
						//var aPos = o_table.fnGetPosition(tmp);
						//o_table.fnUpdate(fetch[1], aPos[0], aPos[1]);
					}
				);
				return(value);
			}, 
			data_editable
		);
		
		data_editable['submit'] = "OK";
		data_editable['type'] = "select";
		data_editable['data'] = "{'yes':products_translation.yes, 'no':products_translation.no}"
		
		//edit any value of any object (of class .editable)
		$j(".editable_boolean", o_table.fnGetNodes()).editable(
			function(value, settings) { 
				var field = this;
				var product_id = field.parentNode.getAttribute("id").split('_')[1];
				var column = o_table.fnGetPosition(field)[2] //???? why [2] and not [1]? - [0] describes the row, [1] describes the column, [2] describes again the column?, [3..] undefined
				var old_value = o_table.fnGetData(field);
				
				var data_post = {
					"action" : "open-csa-wp-update_product",
					"value" : value,
					"product_id": product_id,
					"column": column
				};
				$j.post(ajaxurl, data_post, 
					function(response) { 
						//console.log ("Server returned:["+response+"]");
						
						open_csa_wp_toggle_product_visibility (product_id, products_list_table.attr("open-csa-wp-plugins_dir"));
					}
				);
			
				return(value);
			}, 
			data_editable
		);
	}
	
	var products_tips = $j("#open-csa-wp-showProductsList_div .open-csa-wp-tip_products");
	if(products_tips.length > 0) {
		products_tips.cluetip({
			splitTitle: '|',						 
			showTitle: false,
			hoverClass: 'highlight',
			open: 'slideDown', 
			openSpeed: 'slow'
		});
	}

});


function open_csa_wp_new_product_fields_validation(btn, product_id, url_address) {

	var form = btn.parentNode;
	
	if (!form.checkValidity()) {
		btn.click();
	} else {
		document.getElementById("open-csa-wp-newProductForm_category_input_disabled_id").disabled = false;
		document.getElementById("open-csa-wp-newProductForm_producer_input_disabled_id").disabled = false;
		document.getElementById("open-csa-wp-newProductForm_unit_input_disabled_id").disabled = false;
		document.getElementById("open-csa-wp-newProductForm_availability_input_disabled_id").disabled = false;
		
		var $j = jQuery.noConflict();
		var serialized_form_data = $j('#open-csa-wp-showNewProduct_form').serializeArray();
		var arraySpanElements = [
			"",
			"open-csa-wp-newProductForm_category_input_span_id",
			"open-csa-wp-newProductForm_producer_input_span_id",
			"",
			"",
			"open-csa-wp-newProductForm_unit_input_span_id",
			"",
			"open-csa-wp-newProductForm_availability_input_span_id"
		];
		
		validity = true;
		var i;
		for (i=0; i<8; i++) {
			if (i!= 6 && serialized_form_data[i].value == '') {
				validity = false;
				break;
			}
		}
	
		if (validity == true) {
			open_csa_wp_send_request_add_or_update_product_to_server(btn, product_id, url_address);
		} else {
			open_csa_wp_you_forgot_this_one (document.getElementById(arraySpanElements[i]));
			event.preventDefault();
		}
	}
}

function open_csa_wp_send_request_add_or_update_product_to_server(btn, product_id, url_address) {

	btn.disabled = true;

	var $j = jQuery.noConflict();
	var serialized_form_data = $j('#open-csa-wp-showNewProduct_form').serializeArray();
	serialized_form_data = JSON.stringify(serialized_form_data);
			
	var data = {
		'action': 'open-csa-wp-product_add_or_update_request',
		'product_id': product_id,
		'data'	: serialized_form_data
	};
		
	$j.post(ajaxurl, data ,
		function(response){
			//console.log("Server returned: [" + response + "]");
			btn.disabled = false;
			if (product_id == null) {
				location.reload(true);
			} else {
				window.location.replace(url_address);
			}

	});
}

function open_csa_wp_request_delete_product(product) {

	var $j = jQuery.noConflict();		
	var product_tr = $j(product).closest("tr");

	var product_id = $j(product_tr).attr("id").split('_')[1];
	
	var data = {
		"action" : "open-csa-wp-delete_product",
		"product_id" : product_id
	};
	
	$j.post(ajaxurl, data, 
		function(response) { 
			//console.log ("Server returned:["+response+"]");

			var return_values = response.split(",");
						
			if (return_values[0] == "skipped") {
				alert(products_translation.product_cannnot_be_deleted);
			} else {			
				$j(product_tr).fadeOut(200,function() {
						$j(product_tr).remove();
						
						if ($j('#open-csa-wp-showProductsList_table .open-csa-wp-showProducts-product').length == 0) {
							location.reload(true);
						}
				});
			}
		}
	);
}

function open_csa_wp_request_toggle_product_visibility(image_obj, plugins_dir) {
	var $j = jQuery.noConflict();
	var row = image_obj.parentNode.parentNode;
	var product_id = row.id.split('_')[1];
	
	var availability = row.style.color=='gray'?1:0;
	
	//update database
	var data = {
		"action" : "open-csa-wp-update_product_availability",
		"product_id" : product_id,
		"availability" : availability
	};
	
	
	$j.post(ajaxurl, data, 
		function(response) { 
			//console.log ("Server returned:["+response+"]");
			
			open_csa_wp_toggle_product_visibility (product_id, plugins_dir);
		}
	);
}

function open_csa_wp_toggle_product_visibility (product_id, plugins_dir) {

	obj_tr = document.getElementById ("open-csa-wp-showProductsProductID_"+product_id);
	image_obj = document.getElementById("open-csa-wp-showProductsAvailabilityIconID_"+product_id);;
	text_obj = document.getElementById("open-csa-wp-showProductsAvailabilityID_"+product_id);
	
	//toggle row color, image source, text, and title
	if (obj_tr.style.color=='gray') {
		obj_tr.style.color='black';
		image_obj.src = plugins_dir + "/open-csa-wp/icons/visible.png";
		text_obj.innerHTML = products_translation.yes;
		image_obj.title = products_translation.mark_available;
	} else {
		obj_tr.style.color='gray';
		image_obj.src = plugins_dir + "/open-csa-wp/icons/nonVisible.png";
		text_obj.innerHTML = products_translation.no;
		image_obj.title = products_translation.mark_unavailable;
	}
}


function open_csa_wp_edit_product(product_obj, page_url) {
	var product_tr = $j(product_obj).closest("tr");

	var product_id = $j(product_tr).attr("id").split('_')[1];

	window.location.replace( page_url + "&id=" + product_id);
}

function open_csa_wp_reset_product_form(){
	document.getElementById("open-csa-wp-showNewProduct_form").reset();
	
	document.getElementById("open-csa-wp-newProductForm_category_input_id").style.color = "#999";
	document.getElementById("open-csa-wp-newProductForm_producer_input_id").style.color = "#999";
	document.getElementById("open-csa-wp-newProductForm_unit_input_id").style.color = "#999";
	document.getElementById("open-csa-wp-newProductForm_availability_input_id").style.color = "#999";
	
	document.getElementById("open-csa-wp-newProductForm_category_input_span_id").style.display = "none";
	document.getElementById("open-csa-wp-newProductForm_producer_input_span_id").style.display = "none";
	document.getElementById("open-csa-wp-newProductForm_unit_input_span_id").style.display = "none";
	document.getElementById("open-csa-wp-newProductForm_availability_input_span_id").style.display = "none";

	document.getElementById("open-csa-wp-showNewProduct_button_id").disabled = false;
}