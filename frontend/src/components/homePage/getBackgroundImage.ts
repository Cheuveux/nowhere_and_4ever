interface ImageConfig {
	index: number;
	totalItems: number;
	contentType: "article" | "conversation" | "quiz" | "mosaic";
}

export function getBackgroundImage({index, totalItems, contentType}: ImageConfig): string {

	if (contentType === "conversation")	
		return "/img_assets/folder_homepage/main_content_1.png";
	if (contentType === "quiz")	
		return "/img_assets/folder_homepage/main_content_2.png";
	if (contentType === "mosaic")	
		return "/img_assets/folder_homepage/main_content_1.png";
	if (index === totalItems)
		return "/img_assets/folder_homepage/footer_folder.png";
	if (index % 2 === 1)
		return "/img_assets/folder_homepage/main_content_1.png";
	else
		return "/img_assets/folder_homepage/main_content_2.png";
		
}