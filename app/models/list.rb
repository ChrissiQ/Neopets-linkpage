class List < ActiveRecord::Base
	validates :name, :length => { :within => 3..25 }
	has_and_belongs_to_many :links
end
