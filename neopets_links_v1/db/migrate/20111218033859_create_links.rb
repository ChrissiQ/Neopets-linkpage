class CreateLinks < ActiveRecord::Migration
  def change
    create_table :links do |t|
      t.string :name, :default => "Neopets"
      t.string :url, :default => "http://www.neopets.com/"
      t.integer :timer_minutes, :default => '30'
      t.boolean :timer_daily, :default => false
      t.boolean :timer_monthly, :default => false
      t.integer :timer_specific_month

      t.timestamps
    end
  end
end
