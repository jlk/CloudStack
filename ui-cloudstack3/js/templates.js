(function(cloudStack, testData) { 
  cloudStack.sections.templates = {
    title: 'Templates',
    id: 'templates',
    sectionSelect: {
      label: 'Select view'
    },
    sections: {
      templates: {
        type: 'select',
        title: 'Templates',
        listView: {
          id: 'templates',
          label: 'Templates',
          fields: {
            name: { label: 'Name', editable: true },
            id: { label: 'ID' },
            zonename: { label: 'Zone' },
            hypervisor: { label: 'Hypervisor' }
          },
          actions: {
		    //???
			add: {
              label: 'Create template',			   		  

              messages: {
                confirm: function(args) {
                  return 'Are you sure you want to create a template?';
                },
                success: function(args) {
                  return 'Your new template is being created.';
                },
                notification: function(args) {
                  return 'Creating new template';
                },
                complete: function(args) {
                  return 'Template has been created successfully!';
                }
              },

              createForm: {
                title: 'Create template',
                desc: 'Please fill in the following data to create a new template.',
                
                preFilter: function(args) {    
                  //???                  
                  	if(isAdmin()) {
		                //$readonlyFields = $detailsTab.find("#name, #displaytext, #passwordenabled, #ispublic, #isfeatured, #ostypename");
		                //$editFields = $detailsTab.find("#name_edit, #displaytext_edit, #passwordenabled_edit, #ispublic_edit, #isfeatured_edit, #ostypename_edit");    
                        
                        //$("#dialog_add_template").find("#add_template_public_container").show();
                        args.$form.find('.form-item[rel=isPublic]').css('display', 'inline-block');   
                        
                        //$("#dialog_add_template").find("#add_template_featured_container").show();
                        args.$form.find('.form-item[rel=isFeatured]').css('display', 'inline-block');  
                    }
                    else {  
		                if (getUserPublicTemplateEnabled() == "true") {
			                //$readonlyFields = $detailsTab.find("#name, #displaytext, #passwordenabled, #ispublic, #ostypename");
			                //$editFields = $detailsTab.find("#name_edit, #displaytext_edit, #passwordenabled_edit, #ispublic_edit, #ostypename_edit"); 	
			                		
			                //$("#dialog_add_template").find("#add_template_public_container").show();
			                args.$form.find('.form-item[rel=isPublic]').css('display', 'inline-block');   
		                } 
		                else {
			                //$readonlyFields = $detailsTab.find("#name, #displaytext, #passwordenabled, #ostypename");
			                //$editFields = $detailsTab.find("#name_edit, #displaytext_edit, #passwordenabled_edit, #ostypename_edit");		
			                	
			                //$("#dialog_add_template").find("#add_template_public_container").hide();
			                args.$form.find('.form-item[rel=isPublic]').hide();
		                }		
		                //$("#dialog_add_template #add_template_featured_container").hide();	
		                args.$form.find('.form-item[rel=isFeatured]').hide();	
                    }                  	  
                },			
                
                fields: {
                  name: {
                    label: 'Name',
                    validation: { required: true }
                  },
                  description: {
                    label: 'Description',
                    validation: { required: true }
                  },
                  url: {
                    label: 'URL',
                    validation: { required: true }
                  },
                  zone: {
                    label: 'Zone',
                    select: function(args) {	
                      $.ajax({
						url: createURL("listZones&available=true"),			 
						dataType: "json",
						async: true,
						success: function(json) { 				   
						  var zoneObjs = json.listzonesresponse.zone;							  
						  var items = [];
						  items.push({id: -1, description: "All Zones"});
						  $(zoneObjs).each(function() {
						    items.push({id: this.id, description: this.name});						  
						  });			  
						  args.response.success({data: items});					  
						}
					  });  						 
					}		
                  },     
                  hypervisor: {
                    label: 'Hypervisor',
                    dependsOn: 'zone',
                    select: function(args) {     
                        if(args.zone == null)                           
	                        return; 	                    
                	    
	                    var apiCmd;
	                    if(args.zone == -1) 	
	                        apiCmd = "listHypervisors&zoneid=-1";	 
	                    else	  
	                        apiCmd = "listHypervisors&zoneid=" + args.zone;	  	    
                	    
	                    $.ajax({
                            url: createURL(apiCmd),
                            dataType: "json",
							async: false,
                            success: function(json) {            
                                var hypervisorObjs = json.listhypervisorsresponse.hypervisor;
								var items = [];
								$(hypervisorObjs).each(function(){
								    items.push({id: this.name, description: this.name});
								});								
                                args.response.success({data: items});	
                            }    
                        });   
					}		
                  },        
                  format: {
                    label: 'Format',
                    dependsOn: 'hypervisor',
                    select: function(args) {     
                      var items = [];
                      
                        if(args.hypervisor == "XenServer") {
	                        //formatSelect.append("<option value='VHD'>VHD</option>");	  
	                        items.push({id:'VHD', description: 'VHD'});
	                    }  
	                    else if(args.hypervisor == "VMware") {
	                        //formatSelect.append("<option value='OVA'>OVA</option>");
	                        items.push({id:'OVA', description: 'OVA'});
	                    }
	                    else if(args.hypervisor == "KVM") {
	                        //formatSelect.append("<option value='QCOW2'>QCOW2</option>");
	                        items.push({id:'QCOW2', description: 'QCOW2'});
	                    }
		                else if(args.hypervisor == "BareMetal") {
	                        //formatSelect.append("<option value='BareMetal'>BareMetal</option>");
	                        items.push({id:'BareMetal', description: 'BareMetal'});
	                    }
		                else if(args.hypervisor == "Ovm") {
	                        //formatSelect.append("<option value='RAW'>RAW</option>");  
	                        items.push({id:'RAW', description: 'RAW'});  
	                    }
	                    
	                    args.response.success({data: items});	
                	        
					}		
                  },        
                                    
                  osTypeId: {
                    label: 'OS Type',
                    select: function(args) {	
                      $.ajax({
						url: createURL("listOsTypes"),			 
						dataType: "json",
						async: true,
						success: function(json) { 				   
						  var items = json.listostypesresponse.ostype;						  
						  args.response.success({data: items});					  
						}
					  });  						 
					}		
                  },
                  
                  isExtractable: {
                    label: "Extractable",
                    isBoolean: true
                  },
                  
                  isPasswordEnabled: {
                    label: "Password Enabled",
                    isBoolean: true
                  },
                  
                  isPublic: {
                    label: "Public",
                    isBoolean: true,
					hidden: true
                  },
                  
                  isFeatured: {
                    label: "Featured",
                    isBoolean: true,
					hidden: true
                  }                  				  
                }
              },
              
              action: function(args) {	
                /*
                var array1 = [];
				array1.push("&name=" + args.data.name);
				array1.push("&zoneId=" + args.data.availabilityZone);
				array1.push("&diskOfferingId=" + args.data.diskOffering);
				$.ajax({
				  url: createURL("createVolume" + array1.join("")),
				  dataType: "json",
				  async: true,
				  success: function(json) { 			    
					var jid = json.createvolumeresponse.jobid;	  				
					args.response.success({_custom:{jobId: jid}});							
				  }
				});  	
				*/
			  },			

              notification: {                
				poll: function(args) {			  
                  args.complete();
                }		
              }
            },			
			//???		    
            edit: {
              label: 'Edit template name',
              action: function(args) {
                args.response.success(args.data[0]);
              }
            }
          },
		            
		  dataProvider: function(args) {        
			$.ajax({
			  url: createURL("listTemplates&templatefilter=self&page="+args.page+"&pagesize="+pageSize),
			  dataType: "json",
			  async: true,
			  success: function(json) { 	
				var items = json.listtemplatesresponse.template;			    
				args.response.success({data:items});			                			
			  }
		    });  	
		  }		  
        }
      },
      isos: {
        type: 'select',
        title: 'ISOs',
        listView: {
          label: 'ISOs',
          fields: {
            displaytext: { label: 'Name' },
            id: { label: 'ID' },
            size: { label: 'Size' },
            zonename: { label: 'Zone' }
          },
          
		  //dataProvider: testData.dataProvider.listView('isos')
		  dataProvider: function(args) {        
			$.ajax({
			  url: createURL("listIsos&isofilter=self&page="+args.page+"&pagesize="+pageSize),
			  dataType: "json",
			  async: true,
			  success: function(json) { 	
				var items = json.listisosresponse.iso;			    
				args.response.success({data:items});		                			
			  }
			});  	
		  }		  
        }
      }
    }
  };  
})(cloudStack, testData);
