// Copyright 2012 Citrix Systems, Inc. Licensed under the
// Apache License, Version 2.0 (the "License"); you may not use this
// file except in compliance with the License.  Citrix Systems, Inc.
// reserves all rights not expressly granted by the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 
// Automatically generated by addcopyright.py at 04/03/2012
package com.cloud.hypervisor.vmware.mo;

import org.apache.log4j.Logger;

import com.cloud.hypervisor.vmware.util.VmwareContext;
import com.vmware.vim25.CustomFieldDef;
import com.vmware.vim25.CustomFieldStringValue;
import com.vmware.vim25.ManagedObjectReference;

public class BaseMO {
    private static final Logger s_logger = Logger.getLogger(BaseMO.class);
	
	protected VmwareContext _context;
	protected ManagedObjectReference _mor;

	private String _name;
	
	public BaseMO(VmwareContext context, ManagedObjectReference mor) {
		assert(context != null);
		
		_context = context;
		_mor = mor;
	}
	
	public BaseMO(VmwareContext context, String morType, String morValue) {
		assert(context != null);
		assert(morType != null);
		assert(morValue != null);
		
		_context = context;
		_mor = new ManagedObjectReference();
		_mor.setType(morType);
		_mor.set_value(morValue);
	}
	
	public VmwareContext getContext() {
		return _context;
	}
	
	public ManagedObjectReference getMor() {
		assert(_mor != null);
		return _mor;
	}
	
	public ManagedObjectReference getParentMor() throws Exception {
		return (ManagedObjectReference)_context.getServiceUtil().getDynamicProperty(_mor, "parent");
	}

	public String getName() throws Exception {
		if(_name == null)
			_name = (String)_context.getServiceUtil().getDynamicProperty(_mor, "name");
		
		return _name;
	}
	
	public boolean destroy() throws Exception {
        ManagedObjectReference morTask = _context.getService().destroy_Task(_mor);
        
        String result = _context.getServiceUtil().waitForTask(morTask);
        if(result.equals("sucess")) {
            _context.waitForTaskProgressDone(morTask);
            return true;
        } else {
        	s_logger.error("VMware destroy_Task failed due to " + TaskMO.getTaskFailureInfo(_context, morTask));
        }
        return false;
	}
	
	public void reload() throws Exception {
	    _context.getService().reload(_mor);
	}
	
	public boolean rename(String newName) throws Exception {
	    ManagedObjectReference morTask = _context.getService().rename_Task(_mor, newName);
	    
        String result = _context.getServiceUtil().waitForTask(morTask);
        if(result.equals("sucess")) {
            _context.waitForTaskProgressDone(morTask);
            return true;
        } else {
        	s_logger.error("VMware rename_Task failed due to " + TaskMO.getTaskFailureInfo(_context, morTask));
        }
        return false;
	}
	
	public void setCustomFieldValue(String fieldName, String value) throws Exception {
		CustomFieldsManagerMO cfmMo = new CustomFieldsManagerMO(_context, 
			_context.getServiceContent().getCustomFieldsManager());
		
		int key = getCustomFieldKey(fieldName);
		if(key == 0) {
			try {
				CustomFieldDef field = cfmMo.addCustomerFieldDef(fieldName, getMor().getType(), null, null);
				key = field.getKey();
			} catch (Exception e) {
				// assuming the exception is caused by concurrent operation from other places
				// so we retieve the key again
				key = getCustomFieldKey(fieldName);
			}
		}
		
		if(key == 0)
			throw new Exception("Unable to setup custom field facility");
		
		cfmMo.setField(getMor(), key, value);
	}
	
	public String getCustomFieldValue(String fieldName) throws Exception {
		int key = getCustomFieldKey(fieldName);
		if(key == 0)
			return null;
		
		CustomFieldStringValue cfValue = (CustomFieldStringValue)_context.getServiceUtil().getDynamicProperty(getMor(), 
			String.format("value[%d]", key));
		if(cfValue != null)
			return cfValue.getValue();
		
		return null;
	}
	
	public int getCustomFieldKey(String fieldName) throws Exception {
		return getCustomFieldKey(getMor().getType(), fieldName);
	}
	
	public int getCustomFieldKey(String morType, String fieldName) throws Exception {
		assert(morType != null);
		
		CustomFieldsManagerMO cfmMo = new CustomFieldsManagerMO(_context, 
				_context.getServiceContent().getCustomFieldsManager());
		
		return cfmMo.getCustomFieldKey(morType, fieldName);
	}
}
