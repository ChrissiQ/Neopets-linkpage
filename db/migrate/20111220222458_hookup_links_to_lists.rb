class HookupLinksToLists < ActiveRecord::Migration
   def change
    
    create_table :links_lists, :id => false do |t|
      t.integer "link_id"
      t.integer "list_id"
    end
    add_index :links_lists, ["link_id", "list_id"]
    
  end
end
