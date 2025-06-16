import { toast } from 'react-toastify';

const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        Fields: [
          'Id', 'Name', 'title', 'description', 'category_id', 'priority', 
          'due_date', 'completed', 'completed_at', 'created_at', 'updated_at',
          'is_timer_active', 'timer_start_time', 'timer_last_start_time', 
          'timer_total_time', 'timer_completed_at'
        ],
        orderBy: [
          { FieldName: "created_at", SortType: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          'Id', 'Name', 'title', 'description', 'category_id', 'priority', 
          'due_date', 'completed', 'completed_at', 'created_at', 'updated_at',
          'is_timer_active', 'timer_start_time', 'timer_last_start_time', 
          'timer_total_time', 'timer_completed_at'
        ]
      };

      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          title: taskData.title || "",
          description: taskData.description || "",
          category_id: parseInt(taskData.categoryId) || null,
          priority: taskData.priority || "medium",
          due_date: taskData.dueDate || null,
          completed: false,
          completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_timer_active: false,
          timer_start_time: null,
          timer_last_start_time: null,
          timer_total_time: 0,
          timer_completed_at: null
        }]
      };

      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Task created successfully!');
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
      throw error;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateRecord = {
        Id: parseInt(id),
        updated_at: new Date().toISOString()
      };

      // Only include updateable fields that were provided
      if (updateData.title !== undefined) updateRecord.title = updateData.title;
      if (updateData.description !== undefined) updateRecord.description = updateData.description;
      if (updateData.categoryId !== undefined) updateRecord.category_id = parseInt(updateData.categoryId);
      if (updateData.priority !== undefined) updateRecord.priority = updateData.priority;
      if (updateData.dueDate !== undefined) updateRecord.due_date = updateData.dueDate;
      if (updateData.completed !== undefined) {
        updateRecord.completed = updateData.completed;
        updateRecord.completed_at = updateData.completed ? new Date().toISOString() : null;
      }
      
      // Timer fields
      if (updateData.isTimerActive !== undefined) updateRecord.is_timer_active = updateData.isTimerActive;
      if (updateData.timerStartTime !== undefined) updateRecord.timer_start_time = updateData.timerStartTime;
      if (updateData.timerLastStartTime !== undefined) updateRecord.timer_last_start_time = updateData.timerLastStartTime;
      if (updateData.timerTotalTime !== undefined) updateRecord.timer_total_time = updateData.timerTotalTime;
      if (updateData.timerCompletedAt !== undefined) updateRecord.timer_completed_at = updateData.timerCompletedAt;

      const params = {
        records: [updateRecord]
      };

      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Task updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Task deleted successfully!');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
      return false;
    }
  },

  async getByView(view) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      let where = [];
      
      switch (view) {
        case 'today':
          where = [
            {
              FieldName: "due_date",
              Operator: "ExactMatch",
              Values: [today]
            }
          ];
          break;
        case 'upcoming':
          where = [
            {
              FieldName: "due_date",
              Operator: "GreaterThanOrEqualTo",
              Values: [tomorrowStr]
            },
            {
              FieldName: "completed",
              Operator: "ExactMatch",
              Values: [false]
            }
          ];
          break;
        case 'all':
        default:
          // No filters for all tasks
          break;
      }

      const params = {
        Fields: [
          'Id', 'Name', 'title', 'description', 'category_id', 'priority', 
          'due_date', 'completed', 'completed_at', 'created_at', 'updated_at',
          'is_timer_active', 'timer_start_time', 'timer_last_start_time', 
          'timer_total_time', 'timer_completed_at'
        ],
        where: where,
        orderBy: [
          { FieldName: "created_at", SortType: "DESC" }
        ]
      };

      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by view:", error);
      toast.error("Failed to load tasks");
      return [];
    }
  }
};

// Export the taskService (both default and named for compatibility)
export { taskService };
export default taskService;