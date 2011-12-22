class Link < ActiveRecord::Base
	validates :name, 	:presence => true,
						:length => { :within => 3..25 }
	validates :url,		:presence => true,
						:length => { :within => 3..250 }
	validates_format_of :url, :with => URI::regexp(%w(http https))
	
	has_and_belongs_to_many :lists
	
	def timer
		if timer_minutes then return timer_minutes.to_s + " minutes" end
		if timer_daily then return "per day" end
		if timer_monthly then return "per month" end
		if timer_specific_month then return "Daily in " + Date::MONTHNAMES[timer_specific_month] end
	end
end
