// Addtion Type Define

import type { CartItemFile } from './cart-item';

export interface IFilterQuery {
	field: string;
	condition: 'in' | 'equal' | 'startWith';
	values: any[];
}
export interface IFilterQueryInfo {
	queryList: IFilterQuery[];
	joinCondition?: 'and' | 'or' | ',';
}

// Swagger Type Define
export interface AccountResetInfo {
	/** 인증번호 (이전에 MessageApi의 RequestVerificationCode로 인증번호를 받아야 한다) */
	verificationCode?: string | null;
	/** 인증번호를 요청한 전화번호 */
	phoneNumber?: string | null;
	/** ResetPassword일 때만 사용 : 비밀번호를 변경할 Login ID */
	loginId?: string | null;
	/** ResetPassword일 때만 사용 : 새로운 비밀번호 */
	newPassword?: string | null;
}

export interface AccruedDetail {
	name?: string | null;
	/** @format int32 */
	amount?: number;
}

export interface AddQuotationInput {
	quotaionCartItemIds?: number[] | null;
	title?: string | null;
}

export interface AdditionalProductToProduct {
	/** @format int32 */
	productId?: number;
	product?: Product;
	/** @format int32 */
	additionalProductId?: number;
	additionalProduct?: Product;
}

export interface AdditionalShippingFare {
	/** @format int32 */
	id?: number;
	supplierCode?: string | null;
	supplier?: Supplier;
	/** @format int32 */
	startZipCode?: number;
	/** @format int32 */
	endZipCode?: number;
	title?: string | null;
	/** @format int32 */
	fare?: number;
	/** @format int32 */
	index?: number;
}

export interface ApiError {
	errorCode?: string | null;
	errorObject?: any;
	description?: any;
	exception?: any;
}

export interface BankAccountInfo {
	isActive?: boolean;
	bankCode?: string | null;
	bankName?: string | null;
	bankAccountNumber?: string | null;
	accountHolder?: string | null;
	displayBankAccount?: string | null;
}

export interface Banner {
	/** @format int32 */
	id?: number;
	rotatingBanner?: RotatingBanner;
	/** @format int32 */
	rotatingBannerId?: number;
	deviceType?: DeviceType;
	/** @format int32 */
	order?: number;
	contentType?: BannerContentType;
	content?: string | null;
	description?: string | null;
	linkUrl?: string | null;
	linkTarget?: BannerLinkTarget;
	isOnDisplay?: boolean;
	display?: BannerDisplay;
	/** @format date-time */
	displayStartDate?: string | null;
	/** @format date-time */
	displayEndDate?: string | null;
	/** @format int32 */
	index?: number;
}

export enum BannerContentType {
	Image = 'Image',
	Html = 'Html',
	Url = 'Url'
}

export enum BannerDisplay {
	Always = 'Always',
	Period = 'Period'
}

export enum BannerLinkTarget {
	NewWindow = 'NewWindow',
	CurrentWindow = 'CurrentWindow'
}

export interface BestSeller {
	category?: Category;
	products?: Product[] | null;
}

export interface Bill {
	/** 주문할 장바구니 항목 상세 내역(할인 등등) */
	cartItems?: CartItemViewModel[] | null;
	/**
	 * 합계 상품 가격
	 * @format int32
	 */
	totalAmount?: number;
	shippingFareBeforeDiscount?: OrderShippingFare;
	shippingFare?: OrderShippingFare;
	discounts?: OrderDiscounts;
	additionalPayment?: OrderAdditionalPayment;
	/**
	 * 실 결제 금액
	 * @format int32
	 */
	totalAmountToPay?: number;
	accrued?: OrderAccrued;
}

export interface BillInput {
	/** 주문할 장바구니 항목 ID: Null이면 모든 항목을 주문한다. */
	selectedCartItemIds?: number[] | null;
	/**
	 * 주문시 사용할 적립금 금액(Nullable), 사용가능한 적립금은 CalculateBill의 결과로 돌려준다.
	 * @format int32
	 */
	rewardPointsToUse?: number | null;
	/**
	 * 주문시 사용할 예치금 금액(Nullable), 사용가능한 예치금은 CalculateBill의 결과로 돌려준다.
	 * @format int32
	 */
	depositPointsToUse?: number | null;
	/**
	 * 사용할 주문/상품 쿠폰ID(Nullable)
	 * @format int32
	 */
	orderCoupon?: number | null;
	/**
	 * 사용할 배송비 쿠폰ID(Nullable)
	 * @format int32
	 */
	shippingCoupon?: number | null;
	/** 배송지 우편번호(Nullable), 추가배송비 계산을 위해 사용된다. */
	shippingAddressPostalCode?: string | null;
	paymentMethod?: PaymentMethod;
	separateShipping?: boolean;
}

export interface Board {
	/** @format int32 */
	id?: number;
	userCode?: string | null;
	displayType?: string | null;
	/** @format date-time */
	creationDate?: string;
	useTitleHeader?: boolean;
	titleHeader?: PostTitleHeader;
	/**
	 * @minLength 3
	 * @maxLength 100
	 */
	title: string;
	iconUrl?: string | null;
	description?: string | null;
	writePermission?: BoardPermission;
	canHaveChildren?: boolean;
	canComment?: boolean;
	linkType?: BoardLinkType;
	displayLinkType?: string | null;
	contentForm?: PostContentForm;
	posts?: BoardPost[] | null;
	/** @format int32 */
	newPostHours?: number;
	/** @format int32 */
	totalPostsCount?: number;
	/** @format int32 */
	newPostsCount?: number;
	displayName?: string | null;
	postContent?: BoardPost;
	/** 새 글 알림 받을 지 여부 */
	isNewPostNotified?: boolean;
	/** 답변 달릴 때 알림 받을 지 여부 */
	isReplyNotified?: boolean;
	/** @format int32 */
	index?: number;
}

export enum BoardLinkType {
	NoLink = 'NoLink',
	Product = 'Product',
	Category = 'Category'
}

export enum BoardPermission {
	Anonymous = 'Anonymous',
	Authenticated = 'Authenticated',
	Prohibitted = 'Prohibitted'
}

export interface BoardPost {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	boardId?: number;
	board?: Board;
	/** @format date-time */
	creationDate?: string;
	/** @format date-time */
	modificationDate?: string;
	isNew?: boolean;
	/** @format date-time */
	eventStartDate?: string | null;
	/** @format date-time */
	eventEndDate?: string | null;
	/** @format int32 */
	parentId?: number | null;
	parent?: BoardPost;
	/** @format int32 */
	productId?: number | null;
	product?: Product;
	productName?: string | null;
	/** @format int32 */
	categoryId?: number | null;
	category?: Category;
	categoryName?: string | null;
	/** @format int32 */
	sourceProductId?: number | null;
	sourceProductName?: string | null;
	/** @format int32 */
	sourceCategoryId?: number | null;
	sourceCategoryName?: string | null;
	/** @format int32 */
	orderItemId?: number | null;
	productOptionName?: string | null;
	/** @format int32 */
	fixedOrder?: number | null;
	isFixed?: boolean;
	thumbnailUrl?: string | null;
	title?: string | null;
	content?: string | null;
	formContent?: string | null;
	attachments?: BoardPostAttachment[] | null;
	hasAttachments?: boolean;
	/** @format int32 */
	grade?: number | null;
	authorGuid?: string | null;
	authorDisplayName?: string | null;
	authorEmail?: string | null;
	authorPhoneNumber?: string | null;
	authorIpAddress?: string | null;
	/** @format int32 */
	readCount?: number;
	hasReply?: boolean;
	sendSmsIfReplied?: boolean;
	sendEmailfReplied?: boolean;
	replyStatus?: ReplyStatus;
	replyTitle?: string | null;
	replyContent?: string | null;
	replyAuthorGuid?: string | null;
	replyAuthorDisplayName?: string | null;
	/** @format date-time */
	replyDate?: string;
	children?: BoardPost[] | null;
	isHidden?: boolean;
	isDeleted?: boolean;
	displayReplyStatus?: string | null;
	/** @format int32 */
	index?: number;
}

export interface BoardPostAttachment {
	fileName?: string | null;
	/** @format int64 */
	fileSize?: number;
	url?: string | null;
}

export interface BoardPostODataList {
	result?: BoardPost[] | null;
	/** @format int32 */
	count?: number;
}

export interface BoardPostODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export enum BoardType {
	Normal = 'Normal',
	Gallery = 'Gallery',
	Event = 'Event',
	OneToOne = 'OneToOne',
	Review = 'Review'
}

export interface BundledProductToProduct {
	/** @format int32 */
	productId?: number;
	product?: Product;
	/** @format int32 */
	bundledProductId?: number;
	bundledProduct?: Product;
}

export interface ByteReadOnlyMemory {
	/** @format int32 */
	length?: number;
	isEmpty?: boolean;
}

export interface CanOrderInput {
	/** 주문가능여부를 확인할 장바구니 ID Array, Null이면 전체 */
	selectedCartItemIds?: number[] | null;
}

export interface CanOrderOutput {
	result?: CanOrderOutputItem[] | null;
}

export interface CanOrderOutputItem {
	/** @format int32 */
	cartItemId?: number;
	canOrder?: boolean;
	reason?: string | null;
}

export interface CancelAmount {
	/** @format int32 */
	fee?: number;
	/** @format int32 */
	cash?: number;
	/** @format int32 */
	pg?: number;
	/** @format int32 */
	rewardPoints?: number;
	/** @format int32 */
	deposit?: number;
	/** @format int32 */
	etc?: number;
	/** @format int32 */
	total?: number;
}

export interface Cancellation {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	orderId?: number;
	order?: Order;
	cancelledOrderItems?: CancelledOrderItem[] | null;
	isEntire?: boolean;
	displayType?: string | null;
	reason?: CancellationReason;
	displayReason?: string | null;
	detailedReason?: string | null;
	refundMethod?: RefundMethod;
	displayRefundMethod?: string | null;
	refundAccountInfo?: string | null;
	/** @format int32 */
	expectingAmount?: number;
	/** @format int32 */
	resolvedAmount?: number;
	resolvedAmountDetail?: CancelAmount;
	/** @format date-time */
	requestDate?: string;
	/** @format date-time */
	completeDate?: string | null;
	isResolved?: boolean;
	/** @format int32 */
	index?: number;
}

export interface CancellationODataList {
	result?: Cancellation[] | null;
	/** @format int32 */
	count?: number;
}

export interface CancellationODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export enum CancellationReason {
	Customer = 'Customer',
	ShippingDelayed = 'ShippingDelayed',
	UnshippableRegion = 'UnshippableRegion',
	PoorPackaging = 'PoorPackaging',
	ProductDissatisfied = 'ProductDissatisfied',
	IncorrectInformation = 'IncorrectInformation',
	ServiceDissatisfied = 'ServiceDissatisfied',
	SoldOut = 'SoldOut',
	Etc = 'Etc'
}

export interface CancellationReasonStringKeyValuePair {
	key?: CancellationReason;
	value?: string | null;
}

export enum CancellationType {
	CancelBeforePay = 'CancelBeforePay',
	Refund = 'Refund',
	Exchange = 'Exchange',
	Return = 'Return'
}

export interface CancelledOrderItem {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	cancellationId?: number;
	cancellation?: Cancellation;
	/** @format int32 */
	orderItemId?: number;
	orderItem?: OrderItem;
	/** @format int32 */
	index?: number;
}

export interface CartItem {
	/** @format int32 */
	id?: number;
	cartCode?: string;
	/** @format date-time */
	createDate?: string;
	/** @format date-time */
	modificationDate?: string;
	/** @format int32 */
	productId?: number;
	product?: Product;
	/** @format int32 */
	variantId?: number;
	variant?: ProductVariant;
	/** @format int32 */
	pageCount?: number;
	/** @format int32 */
	quantity?: number;
	title?: string;
	edicusProjectId?: string;
	edicusPsCode?: string;
	attachments?: string;
	fileContents?: FileContent[] | CartItemFile[];
	thumbnailUrl?: string;
	status?: CartItemStatus;
	orgUserGuid?: string;
	userGuid?: string;
	shareCode?: string;
	sharePassword?: string;
	/** @format date-time */
	shareExpireDate?: string;
	outputFolder?: string;
	outputFileNamePrefix?: string;
	/** @format int32 */
	index?: number;
	bundledProducts?: CartBundledProduct[];
	shippingAddress?: CartShippingAddress;
}

export interface CartItemInput extends CartItem {
	fileContents?: CartItemFile[] | FileContent[];
	extraOptions?: Record<string, any>;
}

export interface CartShippingAddress {
	shippingMethod: ShippingMethod;
	hasSenderInfo?: boolean;
	senderName?: string;
	senderZipCode?: string;
	senderAddress1?: string;
	senderAddress2?: string;
	senderPhone?: string;
	senderMobilePhone?: string;
	senderMessage?: string;
	receiverName: string;
	receiverZipCode: string;
	receiverAddress1: string;
	receiverAddress2: string;
	receiverPhone?: string;
	receiverMobilePhone: string;
	shippingMessage?: string;
	// ShippingAdress 객체 보정값
	zipCode?: string;
	address1?: string;
	address2?: string;
}

export interface CartBundledProduct {
	productCode: string;
	productName: string;
	unitPrice: number;
	quantity: number;
	url?: string;
	thumbnailUrl?: string;
}

export interface CartItemODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export interface CartItemRetentionDays {
	shouldDeleteOldData?: boolean;
	isEditingPermanent?: boolean;
	/** @format int32 */
	editing?: number;
	isOrderablePermanent?: boolean;
	/** @format int32 */
	orderable?: number;
	isOrderedPermanent?: boolean;
	/** @format int32 */
	ordered?: number;
}

export enum CartItemStatus {
	Editing = 'Editing',
	Orderable = 'Orderable',
	Ordered = 'Ordered'
}

export interface CartItemViewModel {
	/** @format int32 */
	index?: number;
	cartItem?: CartItem;
	/** @format int32 */
	id?: number;
	/** @format date-time */
	createDate?: string;
	/** @format date-time */
	modificationDate?: string;
	supplierCode?: string | null;
	supplierName?: string | null;
	/** @format int32 */
	productId?: number;
	productName?: string | null;
	productOptionName?: string | null;
	productOptions?: ProductOptionInstance[] | null;
	productUserCode?: string | null;
	productType?: ProductType;
	contentEditingType?: ContentEditingType;
	cartCode?: string | null;
	status?: CartItemStatus;
	/** @format int32 */
	categoryId?: number;
	categoryName?: string | null;
	optionWidgetType?: string | null;
	isExternalOption?: boolean;
	externalOptionClassKey?: string | null;
	externalOptionKey?: string | null;
	/** 외부 옵션 데이터 */
	externalOptionData?: string | null;
	/** @format int32 */
	maxPages?: number | null;
	/** @format int32 */
	maxQuantity?: number | null;
	/** @format int32 */
	pageCount?: number | null;
	/** @format int32 */
	quantity?: number;
	/** @format int32 */
	unitPrice?: number;
	/** @format int32 */
	amount?: number;
	discounts?: OrderDiscountsViewModel;
	edicusProjectId?: string | null;
	edicusPsCode?: string | null;
	fileContents?: FileContent[] | null;
	thumbnailUrl?: string | null;
	title?: string | null;
	isSharedItem?: boolean;
	shareCode?: string | null;
	/** @format date-time */
	shareExpireDate?: string | null;
	hasSharePassword?: boolean;
	ownerGuid?: string | null;
	ownerDisplayName?: string | null;
	/** 공유받아 생성된 장바구니 항목인가? */
	isShareCreatedItem?: boolean;
	/** 원작자 GUID */
	authorGuid?: string | null;
	/** 원작자 이름 */
	authorDisplayName?: string | null;
	/** 이 장바구니 항목은 합주문이 안됨. 복사, 공유도 안됨 */
	isExclusive?: boolean;
	/**  번들 옵션  */
	bundledProducts?: CartBundledProduct[];
	selected?: boolean;
	// 개별 배송지 정보
	shippingAddress?: CartShippingAddress;
	extraOptions?: Record<string, any>;
}

export interface CashReceipts {
	issueType?: CashReceiptsIssueType;
	displayIssueType?: string | null;
	phoneNumber?: string | null;
	email?: string | null;
	businessNo?: string | null;
}

export enum CashReceiptsIssueType {
	Personal = 'Personal',
	Business = 'Business'
}

export interface Category {
	/** @format int32 */
	id?: number;
	userCode?: string | null;
	name?: string | null;
	/** @format int32 */
	order?: number;
	title?: string | null;
	thumbnailUrl?: string | null;
	thumbnail2Url?: string | null;
	bannerImageUrl?: string | null;
	mobileBannerImageUrl?: string | null;
	usePCBannerForMobile?: boolean;
	description?: string | null;
	showCategoryIntroPage?: boolean;
	showUserReview?: boolean;
	productDetailDesc?: ProductDescription[] | null;
	/** @format int32 */
	productDetailDescCount?: number | null;
	isActive?: boolean;
	extraData?: CategoryExtraData;
	/** @format int32 */
	parentId?: number | null;
	parent?: Category;
	children?: Category[] | null;
	products?: Product[] | null;
	/** @format int32 */
	productCount?: number;
	/** @format int32 */
	index?: number;
}

export interface CategoryExtraData {
	badges?: string[] | null;
	tagGroups?: TagGroup[] | null;
}

export interface CategoryName {
	userCode?: string | null;
	name?: string | null;
}

export interface ChangePasswordInput {
	currentPassword?: string | null;
	newPassword?: string | null;
}

export interface CheckVerificationCodeRequest {
	phoneNumber?: string | null;
	code?: string | null;
}

export enum ClaimStatus {
	NoClaim = 'NoClaim',
	CancelBeforePay = 'CancelBeforePay',
	Refund = 'Refund',
	Exchange = 'Exchange',
	Return = 'Return'
}

export interface CloneCartItemInput {
	/** @format int32 */
	cartItemId?: number;
}

export interface CompletePaymentInput {
	/** StartPayment의 결과로 받은 결제 트랜잭션 코드 */
	transactionCode?: string | null;
	/** PG사 코드 : import만 지원함 */
	paymentAgent?: string | null;
	/** Web Client에서 PG사 결제 API를 부른 후 결과 데이터를 stringify한 값 */
	agentClientResultData?: string | null;
}

export interface CompletePaymentOutput {
	success?: boolean;
	errorCode?: string | null;
	errorDescription?: string | null;
	order?: Order;
}

export interface ComputeClause {
	computedItems?: ComputeExpression[] | null;
}

export interface ComputeExpression {
	expression?: any;
	alias?: string | null;
	typeReference?: any;
}

export interface ComputeQueryOption {
	context?: any;
	resultClrType?: string | null;
	computeClause?: ComputeClause;
	rawValue?: string | null;
	validator?: ComputeQueryValidator;
}

export type ComputeQueryValidator = object;

export enum ContentEditingType {
	Edicus = 'Edicus',
	FileUpload = 'FileUpload',
	Mixed = 'Mixed',
	NA = 'NA'
}

export interface Contract {
	termsAndConditions?: string | null;
	privacyPolicy?: string | null;
}

export enum ContractType {
	TermsAndConditions = 'TermsAndConditions',
	PrivacyPolicy = 'PrivacyPolicy',
	All = 'All'
}

export interface CopySharedCartItemInput {
	/** 공윺코드 */
	shareCode?: string | null;
	/** 공유 암호 (Confirm이 true일 때만 필요) */
	sharePassword?: string | null;
	/** 공유된 장바구니 정보만 조회할 지(false), 실제 카피할 지를 결정(true) */
	confirm?: boolean;
}

export interface Corporation {
	code?: string | null;
	name?: string | null;
	businessNo?: string | null;
	representative?: string | null;
	postalCode?: string | null;
	address1?: string | null;
	address2?: string | null;
	contact?: string | null;
	contactPhoneNumber?: string | null;
	contactEmail?: string | null;
}

export interface Coupon {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	couponTemplateId?: number;
	couponTemplate?: CouponTemplate;
	/** @format date-time */
	issueDate?: string;
	/** @format date-time */
	startDate?: string;
	/** @format date-time */
	endDate?: string;
	/** @format date-time */
	useDate?: string | null;
	userGuid?: string | null;
	user?: ShopicusUser;
	orderNo?: string | null;
	isExpired?: boolean;
	isUsed?: boolean;
	displayDuration?: string | null;
	/** @format int32 */
	index?: number;
}

export enum CouponAutomaticIssueEvent {
	FirstOrder = 'FirstOrder',
	Birthday = 'Birthday',
	Register = 'Register',
	Wakeup = 'Wakeup'
}

export enum CouponBenefit {
	Discount = 'Discount',
	RewardPoint = 'RewardPoint'
}

export interface CouponDiscount {
	/** @format int32 */
	product?: number;
	productDetails?: CouponDiscountDetail[] | null;
	/** @format int32 */
	order?: number;
	orderDetails?: CouponDiscountDetail[] | null;
	/** @format int32 */
	shipping?: number;
	shippingDetails?: CouponDiscountDetail[] | null;
	/** @format int32 */
	total?: number;
}

export interface CouponDiscountDetail {
	/** @format int32 */
	couponId?: number;
	/** @format int32 */
	productId?: number | null;
	name?: string | null;
	/** @format int32 */
	amount?: number;
}

export enum CouponIssueType {
	Automatic = 'Automatic',
	Manual = 'Manual',
	Download = 'Download'
}

export interface CouponODataList {
	result?: Coupon[] | null;
	/** @format int32 */
	count?: number;
}

export interface CouponODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export enum CouponPayment {
	AllPaymentMethods = 'AllPaymentMethods',
	CashOnly = 'CashOnly'
}

export enum CouponPurchaseAmountType {
	ProductsAmountOnly = 'ProductsAmountOnly',
	TotalAmount = 'TotalAmount'
}

export interface CouponTemplate {
	/** @format int32 */
	id?: number;
	/** @format date-time */
	registerDate?: string;
	isIssuable?: boolean;
	issueType?: CouponIssueType;
	automaticIssueEvent?: CouponAutomaticIssueEvent;
	name?: string | null;
	description?: string | null;
	supplierText?: string | null;
	validPeriod?: CouponValidPeriod;
	/** @format date-time */
	startDate?: string | null;
	/** @format date-time */
	endDate?: string | null;
	/** @format int32 */
	daysFromIssueDate?: number | null;
	/** @format date-time */
	validEndDate?: string | null;
	/** @format date-time */
	downloadStartDate?: string;
	/** @format date-time */
	downloadEndDate?: string;
	benefit?: CouponBenefit;
	unit?: DiscountUnit;
	/** @format double */
	value?: number;
	/** @format int32 */
	maximumDiscountAmount?: number | null;
	bgImageUrl?: string | null;
	notifyOwner?: boolean;
	allowedPayment?: CouponPayment;
	allowedFor?: DiscountFor;
	allowedProducts?: number[] | null;
	allowedProductsAsProduct?: Product[] | null;
	allowedCategories?: number[] | null;
	allowedCategoriesAsCategory?: Category[] | null;
	disallowedFor?: DiscountFor;
	disallowedProducts?: number[] | null;
	disallowedCategories?: number[] | null;
	/** @format int32 */
	minimumPurchaseAmount?: number;
	purchaseAmountType?: CouponPurchaseAmountType;
	canUseMultiple?: boolean;
	isLimitedIssuance?: boolean;
	/** @format int32 */
	maxIssueCount?: number;
	/** @format int32 */
	issueCount?: number;
	/** @format int32 */
	actualIssueCount?: number;
	displayDuration?: string | null;
	displayType?: string | null;
	displayBenefit?: string | null;
	displayConstraints?: KeyValue[] | null;
	displayIssueType?: string | null;
	displayIssuable?: string | null;
	displayDetail?: string | null;
	/** 다운로드 쿠폰일 경우 로그인한 사용자가 다운로드 받았는지의 여부 */
	isAlreadyDownloaded?: boolean | null;
	/** @format int32 */
	index?: number;
}

export interface CouponTemplateODataList {
	result?: CouponTemplate[] | null;
	/** @format int32 */
	count?: number;
}

export interface CouponTemplateODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export enum CouponType {
	Product = 'Product',
	Order = 'Order',
	Shipping = 'Shipping'
}

export enum CouponValidPeriod {
	Fixed = 'Fixed',
	FromIssueDate = 'FromIssueDate'
}

export enum DeviceType {
	PC = 'PC',
	Mobile = 'Mobile',
	Tablet = 'Tablet',
	Independent = 'Independent'
}

export enum DiscountFor {
	AllProducts = 'AllProducts',
	SpecificProducts = 'SpecificProducts',
	SpecificCategories = 'SpecificCategories'
}

export enum DiscountUnit {
	Amount = 'Amount',
	Percentage = 'Percentage',
	NA = 'NA'
}

export enum DocumentIssuance {
	DontIssue = 'DontIssue',
	TaxBill = 'TaxBill',
	CashReceipts = 'CashReceipts'
}

export interface Domain {
	domainName?: string | null;
	enableCors?: boolean;
	isAuthorized?: boolean;
	/** @format int32 */
	index?: number;
}

export interface EdicusRule {
	entries?: RuleEntry[] | null;
}

export enum EventBoardQuery {
	All = 'All',
	InProgress = 'InProgress',
	NotInProgress = 'NotInProgress'
}

export interface Exhibition {
	/** @format int32 */
	id?: number;
	isHidden?: boolean;
	isActive?: boolean;
	/** @format date-time */
	startDate?: string;
	/** @format date-time */
	endDate?: string;
	/** @format date-time */
	creationDate?: string;
	authorGuid?: string | null;
	thumbnailUrl?: string | null;
	title?: string | null;
	description?: string | null;
	groups?: ExhibitionGroup[] | null;
	isOnGoing?: boolean;
	/** @format int32 */
	index?: number;
}

export interface ExhibitionGroup {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	sortOrder?: number;
	title?: string | null;
	contentType?: string | null;
	content?: string | null;
	/** @format int32 */
	contentWidth?: number;
	/** @format int32 */
	contentHeight?: number;
	uiElements?: UiElement[] | null;
	mobileContent?: string | null;
	/** @format int32 */
	mobileContentWidth?: number;
	/** @format int32 */
	mobileContentHeight?: number;
	mobileUiElements?: UiElement[] | null;
	items?: ExhibitionItem[] | null;
	/** @format int32 */
	index?: number;
}

export interface ExhibitionItem {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	sortOrder?: number;
	thumbnailUrl?: string | null;
	text1?: string | null;
	text1_Color?: string | null;
	/** @format int32 */
	text1_FontSize?: number;
	text2?: string | null;
	text2_Color?: string | null;
	/** @format int32 */
	text2_FontSize?: number;
	text3?: string | null;
	text3_Color?: string | null;
	/** @format int32 */
	text3_FontSize?: number;
	targetUrl?: string | null;
	/** @format int32 */
	productId?: number | null;
	/** @format int32 */
	categoryId?: number | null;
	/** @format int32 */
	index?: number;
}

export interface ExhibitionODataList {
	result?: Exhibition[] | null;
	/** @format int32 */
	count?: number;
}

export interface ExhibitionODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export enum ExhibitionType {
	Exhibition = 'Exhibition',
	Event = 'Event',
	Page = 'Page'
}

export interface ExternalCartItemInput {
	/** @format int32 */
	productId?: number;
	externalOptionData?: string | null;
	/** @format int32 */
	quantity?: number;
	edicusProjectId?: string | null;
	edicusPsCode?: string | null;
	fileContents?: FileContentInput[] | null;
	thumbnailUrl?: string | null;
	/** @format int32 */
	pageCount?: number | null;
	title?: string | null;
}

export interface ExternalLoginForm {
	provider?: string | null;
	loginKey?: string | null;
	secondaryLoginKey?: string | null;
}

export interface Faq {
	/** @format int32 */
	id?: number;
	/** @format date-time */
	creationDate?: string;
	/** @format date-time */
	modificationDate?: string;
	categoryCode?: string | null;
	title?: string | null;
	question?: string | null;
	answer?: string | null;
	/** @format int32 */
	index?: number;
}

export interface FaqODataList {
	result?: Faq[] | null;
	/** @format int32 */
	count?: number;
}

export interface FaqODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export interface FileContent {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	cartItemId?: number | null;
	cartItem?: CartItem;
	/** @format int32 */
	orderItemId?: number | null;
	orderItem?: OrderItem;
	/** @format date-time */
	uploadDate?: string;
	userGuid?: string | null;
	title?: string | null;
	fileName?: string | null;
	fileExtension?: string | null;
	/** @format int64 */
	fileSize?: number;
	url?: string | null;
	/** @format int32 */
	width?: number;
	/** @format int32 */
	height?: number;
	/** @format int32 */
	pageCount?: number;
	isConfirmed?: boolean;
	status?: string | null;
	userComment?: string | null;
	adminComment?: string | null;
	/** @format int32 */
	index?: number;
}

export interface FileContentInput {
	/** @format int32 */
	id?: number | null;
	title?: string | null;
	fileName?: string | null;
	fileExtension?: string | null;
	/** @format int64 */
	fileSize?: number;
	url?: string | null;
}

export interface FindLoginIdResult {
	loginId?: string | null;
}

export enum Gender {
	Male = 'Male',
	Female = 'Female'
}

export interface GetThumbnailsOutput {
	urls?: string[] | null;
}

export enum ImageViewType {
	PageTurn = 'PageTurn',
	Slide = 'Slide',
	NoEffect = 'NoEffect'
}

export interface IpAddressFilter {
	allowList?: string[] | null;
}

export interface Item {
	content?: string | null;
	form?: string | null;
}

export interface KeyValue {
	key?: string | null;
	value?: string | null;
}

export interface LoginForm {
	/** @minLength 1 */
	id: string;
	/**
	 * @format password
	 * @minLength 1
	 */
	password: string;
	rememberMe?: boolean;
}

export enum LongSmsStrategy {
	Cut = 'Cut',
	Split = 'Split',
	ConvertToLms = 'ConvertToLms'
}

export interface Mall {
	/** @format int32 */
	id?: number;
	name?: string | null;
	code?: string | null;
	countryCode?: string | null;
	repAdminPhoneNumber?: string | null;
	repAdminEmailAddress?: string | null;
	adminMemo?: string | null;
	termsAndConditions?: string | null;
	privacyPolicy?: string | null;
	/** @format int32 */
	cancellationTime?: number;
	/** @format int32 */
	autoShippedTransitionDays?: number;
	retentionDays?: CartItemRetentionDays;
	isEmailConfirmNeeded?: boolean;
	isAccountAuditRequired?: boolean;
	domains?: Domain[] | null;
	shippingSetting?: ShippingSetting;
	messageSetting?: MessageSetting;
	paymentSetting?: PaymentSetting;
	isAdminAccessLimited?: boolean;
	adminIpAdressFilter?: IpAddressFilter;
}

export interface Membership {
	/** @format int32 */
	id?: number;
	name?: string | null;
	isDefault?: boolean;
	/** @format date-time */
	registerDate?: string;
	registerUser?: string | null;
	benefit?: MembershipBenefit;
	shippingBenefit?: MembershipShippingBenefit;
	discountStrategy?: MembershipDiscountStrategy;
	/** @format double */
	discountPercentage?: number;
	/** @format double */
	rewardPercentage?: number;
	couponTemplateIds?: number[] | null;
	couponTemplates?: CouponTemplate[] | null;
	/** @format int32 */
	bgColor?: number;
	bgImageUrl?: string | null;
	users?: ShopicusUser[] | null;
	/** @format int32 */
	userCount?: number;
	displayDiscountBenefit?: string | null;
	displayShippingBenefit?: string | null;
	displayRewardBenefit?: string | null;
	/** @format int32 */
	index?: number;
}

export enum MembershipBenefit {
	NoBenefit = 'NoBenefit',
	Discount = 'Discount',
	RewardPoint = 'RewardPoint',
	DiscountAndReward = 'DiscountAndReward'
}

export interface MembershipDiscount {
	/** @format int32 */
	product?: number;
	productDetails?: MembershipDiscountDetail[] | null;
	/** @format int32 */
	shipping?: number;
	shippingDetails?: MembershipDiscountDetail[] | null;
	/** @format int32 */
	total?: number;
}

export interface MembershipDiscountDetail {
	/** @format int32 */
	productId?: number | null;
	name?: string | null;
	/** @format int32 */
	amount?: number;
}

export enum MembershipDiscountStrategy {
	OriginalDiscount = 'OriginalDiscount',
	MembershipDiscount = 'MembershipDiscount',
	OriginalAndMembership = 'OriginalAndMembership'
}

export enum MembershipShippingBenefit {
	NoBenefit = 'NoBenefit',
	FreeShipping = 'FreeShipping'
}

export interface MessageSetting {
	useSmsService?: boolean;
	smsServiceProvider?: string | null;
	useMailService?: boolean;
	mailServiceProvider?: string | null;
	autoSms_IsActive?: boolean;
	autoSms_SenderNumber?: string | null;
	manualSms_SenderNumber?: string | null;
	autoSms_UnsubscribeNumber?: string | null;
	manualSms_UnsubscribeNumber?: string | null;
	autoSms_LongMessageStrategy?: LongSmsStrategy;
	allimTalk_IsActive?: boolean;
	allimTalk_ChannelId?: string | null;
	sms_NcloudServiceId?: string | null;
	sms_AuthParam?: string | null;
	mail_AuthParam?: string | null;
	autoEmail_IsActive?: boolean;
	mailSenderAddress?: string | null;
	mailSenderName?: string | null;
	/** @format int32 */
	index?: number;
}

export interface MoveCartItemsInput {
	cartItemIds?: number[] | null;
	destCartCode?: string | null;
}

export enum NamePrivacyPolicy {
	Realname = 'Realname',
	Nickname = 'Nickname'
}

export enum OptionType {
	Text = 'Text',
	Color = 'Color',
	Image = 'Image'
}

export interface Order {
	/** @format int32 */
	id?: number;
	origin?: string | null;
	userGuid?: string | null;
	user?: ShopicusUser;
	userName?: string | null;
	userDisplayName?: string | null;
	ipAddress?: string | null;
	isFirstOrder?: boolean;
	from?: OrderFrom;
	orderNo?: string | null;
	extOrderNo?: string | null;
	/** @format date-time */
	orderDate?: string;
	items?: OrderItem[] | null;
	/** @format int32 */
	totalQuantity?: number;
	/** @format int32 */
	totalAmount?: number;
	shippingFare?: OrderShippingFare;
	shippingFareBeforeDiscount?: OrderShippingFare;
	discounts?: OrderDiscounts;
	additionalPayment?: OrderAdditionalPayment;
	/** @format int32 */
	actualPaidAmount?: number;
	accrued?: OrderAccrued;
	paymentStatus?: PaymentStatus;
	consumedCouponIds?: number[] | null;
	consumedCoupons?: Coupon[] | null;
	hasOrgOrderInfo?: boolean;
	/** @format int32 */
	org_TotalQuantity?: number;
	/** @format int32 */
	org_TotalAmount?: number;
	/** @format int32 */
	org_ShippingFareId?: number | null;
	org_ShippingFare?: OrderShippingFare;
	/** @format int32 */
	org_DiscountsId?: number | null;
	org_Discounts?: OrderDiscounts;
	/** @format int32 */
	org_AdditionalPaymentId?: number | null;
	org_AdditionalPayment?: OrderAdditionalPayment;
	/** @format int32 */
	org_ActualPaidAmount?: number;
	/** @format int32 */
	org_AccruedId?: number | null;
	org_Accrued?: OrderAccrued;
	org_ConsumedCouponIds?: number[] | null;
	/** @format int32 */
	pending_AccruedId?: number | null;
	pending_Accrued?: OrderAccrued;
	/** @format int32 */
	depositWaitingAmount?: number;
	paymentInfo?: PaymentInfo;
	shippingInfo?: ShippingInfo;
	paymentTransactionCode?: string | null;
	/** @format int32 */
	totalRefundAmount?: number;
	/** @format int32 */
	totalPendingRefundAmount?: number;
	/** @format int32 */
	totalCancelAmount?: number;
	/** @format int32 */
	totalPendingCancelAmount?: number;
	orderMemos?: OrderMemo[] | null;
	hasOrderMemo?: boolean;
	status?: OrderStatus;
	isTest?: boolean;
	isInHouse?: boolean;
	isHidden?: boolean;
	canCancel?: boolean;
	productNameSummary?: string | null;
	itemsDisplayStatus?: string | null;
	/** @format int32 */
	index?: number;
}

export interface OrderAccrued {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	rewardPoints?: number;
	/** @format int32 */
	deposit?: number;
	details?: AccruedDetail[] | null;
	/** @format int32 */
	total?: number;
	/** @format int32 */
	index?: number;
}

export interface OrderAdditionalPayment {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	rewardPoints?: number;
	/** @format int32 */
	deposit?: number;
	/** @format int32 */
	total?: number;
	/** @format int32 */
	index?: number;
}

export interface OrderDiscounts {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	discount_Product?: number;
	discount_Product_Details?: ProductDiscountDetail[] | null;
	/** @format int32 */
	discount_Product_Total?: number;
	/** @format int32 */
	discount_Shipping?: number;
	discount_Shipping_Details?: ShippingDiscountDetail[] | null;
	/** @format int32 */
	membership_Product?: number;
	membership_Product_Details?: MembershipDiscountDetail[] | null;
	/** @format int32 */
	membership_Shipping?: number;
	membership_Shipping_Details?: MembershipDiscountDetail[] | null;
	/** @format int32 */
	membership_Total?: number;
	/** @format int32 */
	coupon_Product?: number;
	coupon_Product_Details?: CouponDiscountDetail[] | null;
	/** @format int32 */
	coupon_Order?: number;
	coupon_Order_Details?: CouponDiscountDetail[] | null;
	/** @format int32 */
	coupon_Shipping?: number;
	coupon_Shipping_Details?: CouponDiscountDetail[] | null;
	/** @format int32 */
	coupon_Total?: number;
	/** @format int32 */
	additional?: number;
	/** @format int32 */
	total?: number;
	/** @format int32 */
	index?: number;
}

export interface OrderDiscountsViewModel {
	/** @format int32 */
	id?: number;
	product?: ProductDiscount;
	shipping?: ShippingDiscount;
	membership?: MembershipDiscount;
	coupon?: CouponDiscount;
	/** @format int32 */
	additional?: number;
	/** @format int32 */
	total?: number;
}

export enum OrderFrom {
	Unknown = 'Unknown',
	PCWeb = 'PCWeb',
	MobileWeb = 'MobileWeb',
	App = 'App',
	ShopLink = 'ShopLink'
}

export interface OrderItem {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	orderId?: number;
	order?: Order;
	edicusOrderId?: string | null;
	extOrderNo?: string | null;
	extOrderItemId?: string | null;
	/** @format int32 */
	cartItemId?: number | null;
	/** @format int32 */
	productId?: number | null;
	extProductCode?: string | null;
	extProductName?: string | null;
	product?: Product;
	/** @format int32 */
	variantId?: number;
	supplierCode?: string | null;
	supplierName?: string | null;
	supplierText?: string | null;
	/** @format int32 */
	categoryId?: number;
	categoryName?: string | null;
	productName?: string | null;
	cartItemTitle?: string | null;
	productType?: ProductType;
	productOptionName?: string | null;
	productOptionDetailJson?: string | null;
	extProductOptionClassKey?: string | null;
	extProductOptionKey?: string | null;
	extProductOptionData?: string | null;
	/** @format int32 */
	pageCount?: number | null;
	/** @format int32 */
	quantity?: number;
	edicusProjectId?: string | null;
	attachments?: string | null;
	fileContents?: FileContent[] | null;
	thumbnailUrl?: string | null;
	/** @format int32 */
	unitPrice?: number;
	/** @format int32 */
	supplyPrice?: number;
	/** @format int32 */
	amount?: number;
	discounts?: OrderDiscountsViewModel;
	/** @format int32 */
	amountToPay?: number;
	status?: OrderItemStatus;
	displayStatus?: string | null;
	errorStatus?: OrderItemErrorStatus;
	/** @format int32 */
	errorCount?: number;
	errorDescription?: string | null;
	supplierStatus?: string | null;
	isErrorSupplierStatus?: boolean;
	reworks?: Rework[] | null;
	supplierDisplayStatus?: string | null;
	claimStatus?: ClaimStatus;
	displayClaimStatus?: string | null;
	isClaimResolved?: boolean | null;
	memo?: string | null;
	shippingCarrierCode?: string | null;
	shippingCarrierName?: string | null;
	shippingTrackNo?: string | null;
	displayWaybillNo?: string | null;
	deliveryTrackUrl?: string | null;
	/** @format date-time */
	shippingStartDate?: string | null;
	isAutoShippingComplete?: boolean;
	/** @format date-time */
	shippingCompleteDate?: string | null;
	shipment?: Shipment;
	outputFolder?: string | null;
	outputFileNamePrefix?: string | null;
	renderedFiles?: RenderedFile[] | null;
	renderType?: RenderType;
	/** @format int32 */
	index?: number;
}

export enum OrderItemErrorStatus {
	NoError = 'NoError',
	AutoCallError = 'AutoCallError',
	ManualError = 'ManualError'
}

export interface OrderItemODataList {
	result?: OrderItem[] | null;
	/** @format int32 */
	count?: number;
}

export interface OrderItemODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export enum OrderItemStatus {
	WaitingDeposit = 'WaitingDeposit',
	WaitingConfirm = 'WaitingConfirm',
	WaitingEdit = 'WaitingEdit',
	Paid = 'Paid',
	Rendering = 'Rendering',
	RenderComplete = 'RenderComplete',
	Producing = 'Producing',
	ShippingReady = 'ShippingReady',
	Shipping = 'Shipping',
	Shipped = 'Shipped',
	Error = 'Error',
	Cancelled = 'Cancelled'
}

export interface OrderMemo {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	orderId?: number | null;
	order?: Order;
	/** @format int32 */
	orderItemId?: number;
	orderItemDesc?: string | null;
	/** @format date-time */
	creationDate?: string;
	authorUserGuid?: string | null;
	authorName?: string | null;
	memoCategory?: string | null;
	isComplete?: boolean;
	memo?: string | null;
	replies?: OrderMemo[] | null;
	/** @format int32 */
	parentId?: number | null;
	/** @format int32 */
	index?: number;
}

export interface OrderODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export interface OrderShippingFare {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	packaging?: number;
	/** @format int32 */
	common?: number;
	/** @format int32 */
	additional?: number;
	/** @format int32 */
	discount?: number;
	/** @format int32 */
	total?: number;
	suppliers?: OrderSupplierShippingFare[] | null;
	/** @format int32 */
	index?: number;
}

export enum OrderStatus {
	Active = 'Active',
	Completed = 'Completed'
}

export interface OrderSummary {
	/** @format int32 */
	activeOrderCount?: number;
	/** @format int32 */
	availableRewardPoints?: number;
	/** @format int32 */
	couponCount?: number;
	/** @format int32 */
	reviewableOrderItemCount?: number;
}

export interface OrderSupplierShippingFare {
	supplierCode?: string | null;
	supplierName?: string | null;
	/** @format int32 */
	packaging?: number;
	/** @format int32 */
	common?: number;
	/** @format int32 */
	additional?: number;
	/** @format int32 */
	total?: number;
}

export interface PageOption {
	/** @format int32 */
	minPages?: number | null;
	/** @format int32 */
	maxPages?: number | null;
	/** @format int32 */
	initialPages?: number | null;
}

export interface PaymentInfo {
	/** @format int32 */
	id?: number;
	/** 입금자 (BankTransfer일 때만) */
	payer?: string | null;
	paymentMethod?: PaymentMethod;
	displayPaymentMethod?: string | null;
	isInstantPayment?: boolean;
	isCashPayment?: boolean;
	isPGRequiredPayment?: boolean;
	/**
	 * 입금일 (input일 경우 사용되지 않음)
	 * @format date-time
	 */
	payDate?: string | null;
	bankCode?: string | null;
	bankName?: string | null;
	bankAccountNumber?: string | null;
	accountHolder?: string | null;
	/**
	 * 가상계좌/무통장입금 유효기간 시작일(input: 미사용)
	 * @format date-time
	 */
	accountValidFrom?: string | null;
	/**
	 * 가상계좌/무통장입금 유효기간 마지막일(input: 미사용)
	 * @format date-time
	 */
	accountValidUntil?: string | null;
	receipt?: Receipt;
	document?: DocumentIssuance;
	/** 발급 서류의 이름 */
	displayDocumentName?: string | null;
	/**
	 * 발급서류 완료 날짜 (Document가 DontIssue가 아닌 경우)
	 * @format date-time
	 */
	documentIssueDate?: string | null;
	taxInvoice?: TaxBill;
	cashReceipts?: CashReceipts;
	/** 후불일 경우, 기업 정보 (학교 등등) */
	corporationCode?: string | null;
	corporation?: Corporation;
	displayBankAccount?: string | null;
	/**
	 * 입금확인일 (input: 미사용)
	 * @format date-time
	 */
	payConfirmDate?: string;
	/** @format int32 */
	index?: number;
}

export interface PaymentInfoInput {
	/** 입금자 (BankTransfer일 때만) */
	payer?: string | null;
	paymentMethod?: PaymentMethod;
	bankCode?: string | null;
	bankName?: string | null;
	bankAccountNumber?: string | null;
	accountHolder?: string | null;
	document?: DocumentIssuance;
	taxInvoice?: TaxBill;
	cashReceipts?: CashReceipts;
	/** 후불일 경우, 기업 정보 (학교 등등) */
	corporationCode?: string | null;
	corporation?: Corporation;
}

export enum PaymentMethod {
	CreditCard = 'CreditCard',
	CorpCreditCard = 'CorpCreditCard',
	BankTransfer = 'BankTransfer',
	VirtualAccount = 'VirtualAccount',
	ElectronicBankTransfer = 'ElectronicBankTransfer',
	MobilePhonePayment = 'MobilePhonePayment',
	Payco = 'Payco',
	SamsungPay = 'SamsungPay',
	KakaoPay = 'KakaoPay',
	NaverPay = 'NaverPay',
	RewardPoint = 'RewardPoint',
	Deposit = 'Deposit',
	Deferred = 'Deferred',
	ExtPayment = 'ExtPayment',
	Unknown = 'Unknown'
}

export interface PaymentSetting {
	/** @format int32 */
	id?: number;
	bankTransferInfo?: BankAccountInfo[] | null;
	/** @format int32 */
	depositDeadlineDays?: number;
	isAutoCancel?: boolean;
	/** @format int32 */
	rewardPointsExpireAfterDays?: number;
	/** @format int32 */
	minUsableRewardPoints?: number;
	pgCode?: PgCode;
	pgEnvironment?: PgEnvironment;
	importId?: string | null;
	importKey?: string | null;
	importSecret?: string | null;
	kcpSiteCode?: string | null;
	kcpSiteKey?: string | null;
	kcpPrivateKeyPassword?: string | null;
	kcpPrivateKey?: string | null;
	kcpCertificate?: string | null;
	cashReceiptIssuerCode?: string | null;
	isCashReceiptAutoIssued?: boolean;
	taxBillIssuerCode?: string | null;
	edicusApiBaseUrl?: string | null;
	edicusApiKey?: string | null;
	edicusEditorBaseUrl?: string | null;
	edicusPartnerId?: string | null;
	/** @format int32 */
	index?: number;
}

export enum PaymentStatus {
	NotPaid = 'NotPaid',
	Paid = 'Paid'
}

export enum PgCode {
	Kcp = 'Kcp',
	Import = 'Import'
}

export enum PgEnvironment {
	Production = 'Production',
	Test = 'Test'
}

export enum PopupContentType {
	Image = 'Image',
	Html = 'Html'
}

export interface PopupPosition {
	/** @format int32 */
	left?: number | null;
	/** @format int32 */
	top?: number | null;
	/** @format int32 */
	width?: number;
	/** @format int32 */
	height?: number;
}

export interface PopupTarget {
	url?: string | null;
}

export enum PopupType {
	Top = 'Top',
	Floating = 'Floating'
}

export type PostContentForm = object;

export interface PostTitleHeader {
	title?: string | null;
	items?: Item[] | null;
}

export interface PrepareShareCartItemOutput {
	/** @format int32 */
	cartItemId?: number;
	shareCode?: string | null;
}

export interface PrepareUploadOutput {
	uploadUrl?: string | null;
	downloadUrl?: string | null;
	method?: string | null;
	headers?: KeyValue[] | null;
}

export interface PriceRule {
	lambda?: string | null;
}

export interface ProblemDetails {
	title?: string | null;
	/** @format int32 */
	status?: number | null;
	detail?: string | null;
	instance?: string | null;
	[key: string]: any;
}

export interface Product {
	/** @format int32 */
	id: number;
	rank?: ProductRank;
	class?: string | null;
	code?: string | null;
	userCode?: string | null;
	/** @format int32 */
	sourceProductId?: number | null;
	isOnSale?: boolean;
	nonSaleMessage?: string | null;
	isOnDisplay?: boolean;
	/** @format int32 */
	popularity?: number;
	/** @format date-time */
	registerDate?: string;
	/** @format date-time */
	modificationDate?: string;
	/** @format date-time */
	displayDate?: string;
	/** @minLength 1 */
	name: string;
	shortDesc?: string | null;
	useDescription?: boolean;
	description?: string | null;
	mobileDescription?: string | null;
	usePCDescriptionForMobile?: boolean;
	uploadImagePath?: string | null;
	thumbnailUrl?: string | null;
	imageViewType?: ImageViewType;
	images?: ProductImage[] | null;
	memo?: string | null;
	categories?: Category[] | null;
	/** @format int32 */
	stockCount?: number | null;
	isFreeShipping?: boolean;
	isExclusive?: boolean;
	exclusiveCode?: string | null;
	/** @format int32 */
	maxPages?: number | null;
	/** @format int32 */
	maxQuantity?: number | null;
	/** @format int32 */
	price?: number;
	/** @format int32 */
	discountedPrice?: number;
	categoryNames?: CategoryName[] | null;
	/** @format int32 */
	propertyId?: number | null;
	property?: ProductProperty;
	variables?: Record<string, string | null>;
	detailDesc?: ProductDescription[] | null;
	/** @format int32 */
	relatedParentProductId?: number | null;
	relatedParentProduct?: Product;
	relatedProducts?: Product[] | null;
	hasAdditionalProducts?: boolean;
	additionalProducts?: AdditionalProductToProduct[] | null;
	bundledProducts?: BundledProductToProduct[] | null;
	tags?: Tag[] | null;
	/** @format int32 */
	sortOrder?: number;
	isDeleted?: boolean;
	/** @format int32 */
	index?: number;
	type?: ProductType;
}

export interface ProductDescription {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	order?: number;
	title?: string | null;
	content?: string | null;
	mobileContent?: string | null;
	usePCContentForMobile?: boolean;
	/** @format int32 */
	categoryId?: number | null;
	category?: Category;
	/** @format int32 */
	index?: number;
}

export enum ProductDetailContentType {
	Url = 'Url',
	ImageUrl = 'ImageUrl',
	Html = 'Html',
	Text = 'Text'
}

export interface ProductDiscount {
	/** @format int32 */
	product?: number;
	productDetails?: ProductDiscountDetail[] | null;
	/** @format int32 */
	total?: number;
}

export interface ProductDiscountDetail {
	/** @format int32 */
	productDiscountId?: number;
	/** @format int32 */
	productId?: number | null;
	name?: string | null;
	/** @format int32 */
	amount?: number;
}

export interface ProductExtOptionQueryExInput {
	product?: Product;
	externalOptionData?: string | null;
}

export interface ProductExtOptionQueryInput {
	edicusRule?: EdicusRule;
	priceRule?: PriceRule;
	supplierCode?: string | null;
	externalOptionClassKey?: string | null;
	externalOptionData?: string | null;
	variables?: Record<string, string | null>;
}

export interface ProductImage {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	productId?: number;
	product?: Product;
	/** @format int32 */
	productVariantId?: number | null;
	productVariant?: ProductVariant;
	url?: string | null;
	/** @format int32 */
	width?: number;
	/** @format int32 */
	height?: number;
	/** @format int32 */
	page?: number;
	/** @format int32 */
	index?: number;
}

export interface ProductODataList {
	result?: Product[] | null;
	/** @format int32 */
	count?: number;
}

export interface ProductODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export interface ProductOption {
	name?: string | null;
	optionType?: OptionType;
	values?: ProductOptionValue[] | null;
}

export interface ProductOptionInstance {
	name?: string | null;
	displayName?: string | null;
	value?: string | null;
	displayValue?: string | null;
}

export interface ProductOptionQueryResult {
	/** @format int32 */
	quantity?: number | null;
	/** @format int32 */
	supplyPrice?: number;
	supplyPriceRawData?: string | null;
	/** @format int32 */
	priceWithoutTax?: number;
	/** @format int32 */
	tax?: number;
	/** @format int32 */
	priceBeforeCorrection?: number;
	/** @format int32 */
	price?: number;
	/** @format int32 */
	discountPrice?: number;
	edicusTemplateUri?: string | null;
	edicusPsCode?: string | null;
	edicusLaunchParams?: string | null;
}

export interface ProductOptionValue {
	value?: string | null;
	textValue?: string | null;
	colorValue?: string | null;
	/** @format int32 */
	addedPrice?: number;
	/** @format int32 */
	pageAdditionPrice?: number | null;
	thumbnailUrl?: string | null;
	metadata?: KeyValue[] | null;
}

export interface ProductProperty {
	/** @format int32 */
	id?: number;
	name?: string | null;
	productType?: ProductType;
	contentEditingType?: ContentEditingType;
	/** @format int32 */
	categoryId?: number | null;
	category?: Category;
	hasOptions?: boolean;
	isExternalOption?: boolean;
	externalOptionKey?: string | null;
	externalOptions?: string | null;
	options?: ProductOption[] | null;
	hasMultiplePages?: boolean;
	pageOption?: PageOption;
	quantityOption?: QuantityOption;
	variantsTemplateUserCode?: string | null;
	variants?: ProductVariant[] | null;
	optionWidgetType?: string | null;
	priceRule?: PriceRule;
	edicusRule?: EdicusRule;
	/** @format int32 */
	basePrice?: number;
	supplierCode?: string | null;
	supplier?: Supplier;
	/** @format int32 */
	refSupplierContractPrice?: number;
	refSupplierContractPriceDesc?: string | null;
	/** @format int32 */
	refSupplierContractPrice2?: number;
	refSupplierContractPrice2Desc?: string | null;
	/** @format int32 */
	refSupplierContractPrice3?: number;
	refSupplierContractPrice3Desc?: string | null;
	hasTax?: boolean;
	/** @format float */
	taxRatePercent?: number;
	/** @format int32 */
	productCount?: number;
	/** @format int32 */
	index?: number;
	bundledProductOptions?: ProductBundleProductOption[];
	badges?: string[];
	usePriceTable: boolean;
	defaultBasePriceTable?: PriceTableItem[];
	extraOptions?: Record<string, string>;
	isShippable?: boolean;
	// 그룹 설정시 사용
	productGroup1?: string;
}

export interface PriceTableItem {
	maxQty: number;
	minQty: number;
	pageAdditionPrice: number;
	supplyPrice: number;
	unitPrice: number;
}

export interface ProductBundleProductOption {
	productCode: string;
	productName: string;
	/** @format int32 */
	unitPrice: number;
}

export enum ProductRank {
	Normal = 'Normal',
	Bundle = 'Bundle',
	Additional = 'Additional'
}

export enum ProductType {
	Photobook = 'Photobook',
	Print = 'Print',
	Frame = 'Frame',
	Calendar = 'Calendar',
	PhoneCase = 'PhoneCase',
	OtherPOD = 'OtherPOD',
	POD = 'POD',
	Instant = 'Instant'
}

export interface ProductVariant {
	/** @format int32 */
	id?: number;
	code?: string;
	userCode?: string;
	isOnSale?: boolean;
	isNotUsed?: boolean;
	/** @format int32 */
	order?: number;
	isInherited?: boolean;
	isExternal?: boolean;
	externalKey?: string;
	externalData?: string;
	optionInstances?: ProductOptionInstance[];
	/** @format int32 */
	quantity?: number;
	/** @format int32 */
	pages?: number;
	title?: string;
	edicusPsCode?: string;
	edicusTemplateUri?: string;
	/** @format int32 */
	supplyPrice?: number;
	/** @format int32 */
	price?: number;
	/** @format int32 */
	pageAdditionPrice?: number;
	/** @format int32 */
	productPropertyId?: number;
	/** @format int32 */
	discountedPrice?: number;
	/** @format int32 */
	index?: number;
}

export interface QuantityOption {
	availableQuantities?: number[] | null;
	canInputDirect?: boolean;
	/** @format int32 */
	step?: number | null;
	/** @format int32 */
	minQuantity?: number | null;
	/** @format int32 */
	maxQuantity?: number | null;
	/** @format int32 */
	intitialQuantity?: number | null;
}

export interface Quotation {
	/** @format int32 */
	id?: number;
	/** @format date-time */
	creationDate?: string;
	userId?: string | null;
	title?: string | null;
	items?: QuotationItem[] | null;
	/** @format int32 */
	totalQuantity?: number;
	/** @format int32 */
	itemsAmount?: number;
	/** @format int32 */
	itemsDiscountedAmount?: number;
	/** @format int32 */
	additionalDiscount?: number;
	/** @format int32 */
	totalAmount?: number;
	/** @format int32 */
	index?: number;
}

export interface QuotationCartItem {
	/** @format int32 */
	id?: number;
	userId?: string | null;
	/** @format int32 */
	productId?: number;
	product?: Product;
	/** @format int32 */
	variantId?: number;
	variant?: ProductVariant;
	/** @format int32 */
	quantity?: number;
	/** @format int32 */
	price?: number;
	/** @format int32 */
	discountedPrice?: number;
	/** @format int32 */
	index?: number;
}

export interface QuotationCartItemODataList {
	result?: QuotationCartItem[] | null;
	/** @format int32 */
	count?: number;
}

export interface QuotationCartItemODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export interface QuotationItem {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	productId?: number;
	product?: Product;
	/** @format int32 */
	variantId?: number;
	variant?: ProductVariant;
	/** @format int32 */
	quantity?: number;
	/** @format int32 */
	price?: number;
	/** @format int32 */
	discountedPrice?: number;
	/** @format int32 */
	index?: number;
}

export interface QuotationODataList {
	result?: Quotation[] | null;
	/** @format int32 */
	count?: number;
}

export interface QuotationODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export interface Receipt {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	orderId?: number | null;
	order?: Order;
	orderNo?: string | null;
	orderItemsDisplayStatus?: string | null;
	/** @format date-time */
	payDate?: string | null;
	displayType?: string | null;
	taxBill?: TaxBill;
	cashReceipt?: CashReceipts;
	/** @format date-time */
	requestDate?: string | null;
	/** @format date-time */
	agentRequestDate?: string | null;
	/** @format date-time */
	issueDate?: string | null;
	requester?: string | null;
	productName?: string | null;
	/** @format int32 */
	amount?: number;
	/** @format int32 */
	subtotal?: number;
	/** @format int32 */
	tax?: number;
	transactionNo?: string | null;
	status?: ReceiptStatus;
	displayStatus?: string | null;
	statusDetail?: string | null;
	requestLog?: string | null;
	responseLog?: string | null;
	cancellations?: ReceiptCancellation[] | null;
	/** @format int32 */
	index?: number;
}

export interface ReceiptCancellation {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	receiptId?: number;
	receipt?: Receipt;
	/** @format date-time */
	requestDate?: string | null;
	/** @format date-time */
	agentRequestDate?: string | null;
	/** @format int32 */
	amount?: number;
	/** @format int32 */
	subtotal?: number;
	/** @format int32 */
	tax?: number;
	status?: ReceiptStatus;
	statusDetail?: string | null;
	requestLog?: string | null;
	responseLog?: string | null;
}

export enum ReceiptStatus {
	Requested = 'Requested',
	RequestedToAgent = 'RequestedToAgent',
	WaitingForIssuance = 'WaitingForIssuance',
	Issued = 'Issued',
	Canceled = 'Canceled',
	Denied = 'Denied',
	ErrorInRequest = 'ErrorInRequest',
	ErrorInIssuance = 'ErrorInIssuance',
	NA = 'NA'
}

export enum ReceiptType {
	NA = 'NA',
	TaxBill = 'TaxBill',
	CashReceipt = 'CashReceipt'
}

export enum RefundMethod {
	PG = 'PG',
	Cash = 'Cash',
	RewardPoints = 'RewardPoints',
	Deposit = 'Deposit',
	Etc = 'Etc'
}

export enum RenderStatus {
	NA = 'NA',
	Waiting = 'Waiting',
	Rendering = 'Rendering',
	Success = 'Success',
	Failed = 'Failed'
}

export enum RenderType {
	NA = 'NA',
	PreRender = 'PreRender',
	PostRender = 'PostRender'
}

export interface RenderedFile {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	orderItemId?: number;
	orderItem?: OrderItem;
	edicusOrderId?: string | null;
	status?: RenderStatus;
	displayStatus?: string | null;
	statusDetail?: string | null;
	/** @format date-time */
	renderDate?: string | null;
	content?: string | null;
	url?: string | null;
	/** @format date-time */
	urlExpireDate?: string | null;
	fileFormat?: string | null;
	/** @format int32 */
	index?: number;
}

export enum ReplyStatus {
	Received = 'Received',
	WaitingForReply = 'WaitingForReply',
	Replied = 'Replied'
}

export interface Result {
	token?: string | null;
	refreshToken?: string | null;
	/** @format int32 */
	expireIn?: number;
}

export enum RewardPointsChangeReason {
	AddAdmin = 'Add_Admin',
	SubAdmin = 'Sub_Admin',
	SubPurchase = 'Sub_Purchase',
	SubRefundRecalc = 'Sub_RefundRecalc',
	AddPurchase = 'Add_Purchase',
	AddRefundRecalc = 'Add_RefundRecalc',
	AddNewUser = 'Add_NewUser',
	SubExpire = 'Sub_Expire',
	Others = 'Others'
}

export interface RewardPointsHistory {
	/** @format int32 */
	id?: number;
	/** @format date-time */
	date?: string;
	userId?: string | null;
	user?: ShopicusUser;
	/** @format int32 */
	totalAmountBefore?: number;
	/** @format int32 */
	amount?: number;
	/** @format int32 */
	totalAmountAfter?: number;
	reason?: RewardPointsChangeReason;
	/** @format int32 */
	orderId?: number | null;
	order?: Order;
	displayReason?: string | null;
	detailedReason?: string | null;
	changerId?: string | null;
	changer?: ShopicusUser;
	changerDisplayName?: string | null;
	/** @format int32 */
	index?: number;
}

export interface RewardPointsHistoryODataList {
	result?: RewardPointsHistory[] | null;
	/** @format int32 */
	count?: number;
}

export interface RewardPointsHistoryODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export interface Rework {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	orderItemId?: number;
	orderItem?: OrderItem;
	orgEdicusProjectId?: string | null;
	orgEdicusOrderId?: string | null;
	edicusProjectId?: string | null;
	edicusOrderId?: string | null;
	edicusUserId?: string | null;
	editorGuid?: string | null;
	editorDisplayName?: string | null;
	status?: string | null;
	/** @format date-time */
	createDate?: string | null;
	/** @format date-time */
	editDate?: string | null;
	/** @format date-time */
	orderDate?: string | null;
	displayStatus?: string | null;
	/** @format int32 */
	index?: number;
}

export interface RotatingBanner {
	/** @format int32 */
	id?: number;
	/** @format date-time */
	registerDate?: string;
	/** @format date-time */
	modificationDate?: string;
	code?: string | null;
	title?: string | null;
	isOnDisplay?: boolean;
	display?: BannerDisplay;
	/** @format date-time */
	displayStartDate?: string | null;
	/** @format date-time */
	displayEndDate?: string | null;
	transitionEffect?: string | null;
	banners?: Banner[] | null;
	usePCBannersForMobile?: boolean;
	pcBanners?: Banner[] | null;
	mobileBanners?: Banner[] | null;
	/** @format int32 */
	index?: number;
}

export interface RuleEntry {
	path?: string | null;
	psCode?: string | null;
	templateUri?: string | null;
	option?: string | null;
}

export interface SearchClause {
	expression?: any;
}

export interface SearchQueryOption {
	context?: any;
	resultClrType?: string | null;
	searchClause?: SearchClause;
	rawValue?: string | null;
}

export interface SetCartItemStatusInput {
	cartItemIds?: number[] | null;
	destStatus?: CartItemStatus;
}

export interface ShareCartItemInput {
	/** @format int32 */
	cartItemId?: number;
	shareCode?: string | null;
	sharePassword?: string | null;
	/** @format int32 */
	validSeconds?: number;
}

export interface Shipment {
	/** @format int32 */
	id?: number;
	shipNo?: string | null;
	/** @format date-time */
	creationDate?: string;
	orderItems?: OrderItem[] | null;
	carrierCode?: string | null;
	carrierName?: string | null;
	trackNo?: string | null;
	receiverName?: string | null;
	receiverPhoneNumber?: string | null;
	receiverMobilePhoneNumber?: string | null;
	receiverZipCode?: string | null;
	receiverAddress?: string | null;
	shippingMessage?: string | null;
	/** @format int32 */
	index?: number;
}

export interface ShippingAddress {
	/** @format int32 */
	id?: number;
	name?: string;
	isDefault?: boolean;
	ordererName?: string;
	ordererPhone?: string;
	ordererMobilePhone?: string;
	ordererEmail?: string;
	receiverName?: string;
	receiverPhone?: string;
	receiverMobilePhone?: string;
	zipCode?: string;
	address1?: string;
	address2?: string;
	/** @format int32 */
	index?: number;
	// For Client
	checked?: boolean;
	shippingMessage?: string;
}

export interface ShippingAddressODataList {
	result?: ShippingAddress[] | null;
	/** @format int32 */
	count?: number;
}

export interface ShippingAddressODataQueryOptions {
	ifMatch?: any;
	ifNoneMatch?: any;
	request?: any;
	context?: any;
	rawValues?: any;
	selectExpand?: any;
	apply?: any;
	compute?: ComputeQueryOption;
	filter?: any;
	search?: SearchQueryOption;
	orderBy?: any;
	skip?: any;
	skipToken?: any;
	top?: any;
	count?: any;
	validator?: any;
}

export interface ShippingCompleteInput {
	orderItemIds?: number[] | null;
}

export interface ShippingDiscount {
	/** @format int32 */
	shipping?: number;
	shippingtDetails?: ShippingDiscountDetail[] | null;
	/** @format int32 */
	total?: number;
}

export interface ShippingDiscountDetail {
	/** @format int32 */
	shippingDiscountId?: number;
	name?: string | null;
	/** @format int32 */
	amount?: number;
}

export interface ShippingInfo {
	/** @format int32 */
	id?: number;
	/** 배송지 정보를 배송지 목록에서 가져 온 경우, 이 이름을 배송지 이름으로 설정해야 한다. */
	shippingAddressName?: string | null;
	shippingMethod?: ShippingMethod;
	/** 주문자 */
	ordererName?: string | null;
	/** 주문자 전화번호 */
	ordererPhone?: string | null;
	/** 주문자 휴대폰 번호 */
	ordererMobilePhone?: string | null;
	/** 주문자 Email */
	ordererEmail?: string | null;
	/** 수령인 이름 */
	receiverName?: string | null;
	/** 수령인 전화번호 */
	receiverPhone?: string | null;
	/** 수령인 휴대폰 번호 */
	receiverMobilePhone?: string | null;
	/** 배송지 우편번호 */
	zipCode?: string | null;
	/**
	 * 배송지 시도 -> 제작사에 따라 이 정보를 요구하는 경우가 있음 (사용하지 않음: 삭제할 것)
	 * @deprecated
	 */
	siDo?: string | null;
	/**
	 * 배송지 시군구 -> 제작사에 따라 이 정보를 요구하는 경우가 있음 (사용하지 않음: 삭제할 것)
	 * @deprecated
	 */
	siGunGu?: string | null;
	/**
	 * 배송지 읍면동 -> 제작사에 따라 이 정보를 요구하는 경우가 있음 (사용하지 않음: 삭제할 것)
	 * @deprecated
	 */
	eupMyeonDong?: string | null;
	/** 배송지 주소 1 */
	address1?: string | null;
	/** 배송지 주소 2 */
	address2?: string | null;
	/** 배송 메시지 */
	shippingMessage?: string | null;
	/** @format int32 */
	index?: number;
}

export enum ShippingMethod {
	D2D = 'D2D',
	D2DPostPay = 'D2DPostPay',
	Pickup = 'Pickup',
	QuickService = 'QuickService'
}

export interface ShippingSetting {
	senderName?: string | null;
	senderPhone?: string | null;
	senderMobilePhone?: string | null;
	senderZipCode?: string | null;
	/** @deprecated */
	senderSiDo?: string | null;
	/** @deprecated */
	senderSiGunGu?: string | null;
	/** @deprecated */
	senderEupMyeonDong?: string | null;
	senderAddress1?: string | null;
	senderAddress2?: string | null;
	/** @format int32 */
	freeShippingLimit?: number;
	freeShippingPaymentMethods?: PaymentMethod[] | null;
	/** @format int32 */
	shippingFare?: number;
	useAdditionalFare?: boolean;
	additionalFares?: AdditionalShippingFare[] | null;
	useSupplierFare?: boolean;
	/** @format int32 */
	index?: number;
}

export interface ShopBoardPostInput {
	/** 게시판 코드 */
	boardCode?: string | null;
	/**
	 * 주문항목 OrderItem ID(주문에 대한 리뷰 게시판일 경우에만 사용), 이 값이 입력되면 ProductId, CategoryId가 주문상품 정보로 대체된다
	 * @format int32
	 */
	orderItemId?: number | null;
	/**
	 * 제목
	 * @example "문의사항입니다."
	 */
	title?: string | null;
	/** @example "배송은 언제되나요?" */
	content?: string | null;
	/** 게시글 썸네일 URL */
	thumbnailUrl?: string | null;
	/** 컨텐트 중 구조화된 데이터 */
	formContent?: string | null;
	attachments?: BoardPostAttachment[] | null;
	/**
	 * 별점(필요한 상황일 경우에만, 아니면 Null또는 생략가능)
	 * @format int32
	 */
	grade?: number | null;
	/**
	 * 작성자 이름(비로그인 회원일 경우에만 사용한다. 로그인 회원일 경우 무시된다.)
	 * @example "지나가는 나그네"
	 */
	authorDisplayName?: string | null;
	authorEmail?: string | null;
	authorPhoneNumber?: string | null;
	/** 답변이 달리면 SMS로 알려준다(1:1 게시판에서만 사용) */
	sendSmsIfReplied?: boolean;
	/** 답변이 달리면 Email로 알려준다(1:1 게시판에서만 사용) */
	sendEmailIfReplied?: boolean;
}

export interface ShopCancelInput {
	reason?: CancellationReason;
	detailedReason?: string | null;
}

export interface ShopCategory {
	/** @format int32 */
	id?: number;
	userCode?: string | null;
	name?: string | null;
	title?: string | null;
	description?: string | null;
	showCategoryIntroPage?: boolean;
	showUserReview?: boolean;
	bannerImageUrl?: string | null;
	mobileBannerImageUrl?: string | null;
	thumbnailUrl?: string | null;
	thumbnail2Url?: string | null;
	extraData?: CategoryExtraData;
	/** @format int32 */
	productDetailDescCount?: number | null;
	isActive?: boolean;
	children?: ShopCategory[] | null;
	launchUrl?: string;
}

export interface ShopCode {
	code?: string | null;
	displayName?: string | null;
}

export interface ShopExhibition {
	/** @format int32 */
	id?: number;
	/** @format date-time */
	startDate?: string;
	/** @format date-time */
	endDate?: string;
	thumbnailUrl?: string | null;
	title?: string | null;
	description?: string | null;
	groups?: ShopExhibitionGroup[] | null;
}

export interface ShopExhibitionGroup {
	/** @format int32 */
	id?: number;
	title?: string | null;
	contentType?: string | null;
	pc?: ShopExhibitionGroupData;
	mobile?: ShopExhibitionGroupData;
	items?: ExhibitionItem[] | null;
}

export interface ShopExhibitionGroupData {
	content?: string | null;
	/** @format int32 */
	contentWidth?: number;
	/** @format int32 */
	contentHeight?: number;
	uiElements?: UiElement[] | null;
}

export interface ShopFavoriteProductInput {
	/** @format int32 */
	productId?: number;
}

export interface ShopOrderItemStatus {
	/** @format int32 */
	orderItemId?: number;
	orderItemStatus?: OrderItemStatus;
}

export interface ShopOrderStatusCount {
	status?: Record<string, number | null>;
	claimStatus?: Record<string, number | null>;
}

/** ShopPaymentSettings */
export interface ShopPaymentSettings {
	/**
	 * 무통장입금 유효기간 (일)
	 * @format int32
	 */
	depositDeadlineDays?: number;
	/** 무통장 자동취소여부 */
	isAutoCancel?: boolean;
	/**
	 * 적립금 유효기간 (일) : 0이면 유효기간 없음
	 * @format int32
	 */
	rewardPointsExpireAfterDays?: number;
	/**
	 * 사용가능한 적립금 최소 금액
	 * @format int32
	 */
	minUsableRewardPoints?: number;
}

export interface ShopPopup {
	/** @format int32 */
	id?: number;
	/** 팝업 이름 */
	title?: string | null;
	/** 오늘 보이지 않기 사용 */
	useHideToday?: boolean;
	/** 언제 보일지를 나타냄(현재 사용하지 않음) */
	conditions?: string | null;
	target?: PopupTarget;
	position?: PopupPosition;
	/** 배경 색상 */
	backgroundColor?: string | null;
	contentType?: PopupContentType;
	/** 팝업 내용 (이미지일 경우 URL) */
	content?: string | null;
}

export interface ShopProduct {
	/** @format int32 */
	id: number;
	/** @format date-time */
	registerDate?: string;
	name?: string | null;
	categories?: ShopProductCategory[] | null;
	shortDesc?: string | null;
	thumbnailUrl?: string | null;
	isOnSale?: boolean;
	nonSaleMessage?: string | null;
	/** @format int32 */
	price?: number;
	/** @format int32 */
	discountedPrice?: number;
}

export interface ShopProductCategory {
	/** @format int32 */
	id?: number;
	userCode?: string | null;
}

export interface ShopProductDataList {
	result?: ShopProduct[] | null;
	/** @format int32 */
	count?: number;
}

export interface ShopUser {
	guid?: string | null;
	userid: string;
	username: string;
	loginProvider?: string | null;
	email?: string | null;
	role?: string | null;
	membershipName?: string | null;
	loginFrom?: string | null;
	/** @format date-time */
	registerDate?: string | null;
	/** @format date-time */
	lastLoginDate?: string | null;
	userType?: string;
}

export interface ShopUserInput {
	/** 회원 이름 */
	displayName?: string | null;
	/** 비밀번호 변경시 true */
	isChangingPassword?: boolean;
	/** 이전 비밀번호 */
	oldPassword?: string | null;
	/** 비밀번호 */
	password?: string | null;
	/** Email 주소 */
	email?: string | null;
	/** 광고성 Email 수신 여부 */
	isPromoEmailAllowed?: boolean;
	/** 휴대폰 번호 변경시 true */
	isChangingMobilePhoneNumber?: boolean;
	/** 인증번호 */
	verificationCode?: string | null;
	/** 새로운 휴대폰 번호 */
	mobilePhoneNumber?: string | null;
	/** 광고성 문자 메시지 수신여부 */
	isPromoSmsAllowed?: boolean;
}

export interface ShopUserProfile {
	/** 별명 */
	nickname?: string | null;
	namePrivacyPolicy?: NamePrivacyPolicy;
	/** 소개글 */
	introduction?: string | null;
	/** 프로필 이미지 URL */
	profileImageUrl?: string | null;
}

export interface ShopicusUser {
	/** @format int32 */
	mallId?: number | null;
	mall?: Mall;
	/**
	 * 로그인 Provider
	 * @example "tvill"
	 */
	loginProvider?: string | null;
	/** 외부 로그인 사용자 번호 */
	externalUserNo?: string | null;
	lastLoginKey?: string | null;
	lastSecondaryLoginKey?: string | null;
	displayType?: string | null;
	/** @format int32 */
	membershipId?: number | null;
	membership?: Membership;
	membershipName?: string | null;
	password?: string | null;
	displayName?: string | null;
	nickname?: string | null;
	namePrivacyPolicy?: NamePrivacyPolicy;
	introduction?: string | null;
	profileImageUrl?: string | null;
	isPromoEmailAllowed?: boolean;
	/** @format date-time */
	emailPromoDate?: string;
	isPromoSmsAllowed?: boolean;
	/** @format date-time */
	smsPromoDate?: string;
	zipCode?: string | null;
	address1?: string | null;
	address2?: string | null;
	mobilePhoneNumber?: string | null;
	additionalPhoneNumber?: string | null;
	job?: string | null;
	gender?: Gender;
	/** @format date-time */
	birthDate?: string | null;
	isMarried?: boolean | null;
	/** @format date-time */
	weddingDate?: string | null;
	recommender?: string | null;
	userMemo?: string | null;
	businessName?: string | null;
	businessNo?: string | null;
	businessRepre?: string | null;
	businessType?: string | null;
	businessItem?: string | null;
	businessZipCode?: string | null;
	businessAddress1?: string | null;
	businessAddress2?: string | null;
	/**
	 * 사용자가 여태까지 주문한 상품 금액 총합
	 * @format int32
	 */
	totalPurchaseAmount?: number;
	/**
	 * 사용자가 여태까지 주문한 결제 금액 총합
	 * @format int32
	 */
	totalActualPaidAmount?: number;
	/**
	 * 주문 횟수
	 * @format int32
	 */
	orderCount?: number;
	/**
	 * 적립금
	 * @format int32
	 */
	rewardPoints?: number;
	/**
	 * 최종 적립금 소멸시점의 적립금 합 : 다음 소멸 적립금 계산시 필요
	 * @format int32
	 */
	lastRewardPoints?: number;
	/**
	 * 최종 적립금 소멸 시점
	 * @format date-time
	 */
	lastRewardPointsExpireDate?: string;
	/**
	 * 예치금
	 * @format int32
	 */
	depositPoints?: number;
	/**
	 * 가입일
	 * @format date-time
	 */
	registerDate?: string;
	registerFrom?: string | null;
	/**
	 * 로그인 횟수
	 * @format int32
	 */
	loginCount?: number;
	/**
	 * 장바구니 항목 개수(주문됨 제외)
	 * @format int32
	 */
	cartItemCount?: number | null;
	/** @format date-time */
	lastLoginDate?: string;
	/** @format date-time */
	lastAccessDate?: string;
	lastAccessApi?: string | null;
	/** @format date-time */
	unregisterDate?: string | null;
	cartItems?: CartItem[] | null;
	coupons?: Coupon[] | null;
	isAdmin?: boolean;
	service?: string | null;
	/** @format int32 */
	index?: number;
	isBlocked?: boolean;
	id?: string | null;
	userName?: string | null;
	normalizedUserName?: string | null;
	email?: string | null;
	normalizedEmail?: string | null;
	emailConfirmed?: boolean;
	passwordHash?: string | null;
	securityStamp?: string | null;
	concurrencyStamp?: string | null;
	phoneNumber?: string | null;
	phoneNumberConfirmed?: boolean;
	twoFactorEnabled?: boolean;
	/** @format date-time */
	lockoutEnd?: string | null;
	lockoutEnabled?: boolean;
	/** @format int32 */
	accessFailedCount?: number;
}

export interface Showcase {
	/** @format int32 */
	id?: number;
	code?: string | null;
	/** @format date-time */
	registerDate?: string;
	title?: string | null;
	desc?: string | null;
	categories?: ShowcaseCategory[] | null;
	/** @format int32 */
	categoryCount?: number;
	/** @format int32 */
	index?: number;
}

export interface ShowcaseCategory {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	showcaseId?: number | null;
	showcase?: Showcase;
	/** @format int32 */
	displayOrder?: number;
	isActive?: boolean;
	/** @format int32 */
	categoryId?: number;
	category?: Category;
	productIds?: number[] | null;
	products?: Product[] | null;
	imageUrl?: string | null;
	promoText?: string | null;
	promoSubText?: string | null;
	linkUrl?: string | null;
	/** @format int32 */
	index?: number;
}

export interface SignInResult {
	succeeded?: boolean;
	isLockedOut?: boolean;
	isNotAllowed?: boolean;
	requiresTwoFactor?: boolean;
}

export interface SimpleOrder {
	/**
	 * Order ID (Database key)
	 * @format int32
	 */
	id?: number;
	/** 주문번호 */
	orderNo?: string | null;
	/**
	 * 주문일
	 * @format date-time
	 */
	orderDate?: string;
	/** 상품 이름 요약 (다수 일 경우 외 n이 붙음) */
	displayProductName?: string | null;
	/** 첫번쨰 품목 썸네일 URL */
	displayThumbnailUrl?: string | null;
	/**
	 * 총 결제금액 (할인, 배송비 등으로 총 상품가격과는 다를 수 있음)
	 * @format int32
	 */
	actualPaidAmount?: number;
	/**
	 * 예정 적립금
	 * @format int32
	 */
	pendingAccruedRewardPoints?: number;
	/**
	 * 적립금
	 * @format int32
	 */
	accruedRewardPoints?: number;
	document?: DocumentIssuance;
	/** 증빙서류의 이름 */
	displayDocumentName?: string | null;
	status?: OrderItemStatus;
	displayStatus?: string | null;
	claimStatus?: ClaimStatus;
	displayClaimStatus?: string | null;
	/**
	 * 총 항목 수 * 수량
	 * @format int32
	 */
	totalQuantity?: number;
	/**
	 * 총 상품 가격
	 * @format int32
	 */
	totalAmount?: number;
	canCancel?: boolean;
}

export interface SimpleOrderODataList {
	result?: SimpleOrder[] | null;
	/** @format int32 */
	count?: number;
}

export type SkipTokenHandler = object;

export interface StartPaymentInput {
	billInput?: BillInput;
	/**
	 * PG사 고유이름
	 * @example "import"
	 */
	paymentAgent?: string | null;
	/** PG로 넘길 데이터를 stringify한 내용 */
	agentClientRequestData?: string | null;
	paymentInfo?: PaymentInfoInput;
	shippingInfo?: ShippingInfo;
	/** 이 값을 true로 지정하면 이 주소를 주소록에 저장하고 기본 주소로 설정한다. */
	setAsDefaultShippingAddress?: boolean;
	/** 이 값을 true로 지정하면 주문자 정보로 회원정보를 갱신한다. */
	updateUserInfo?: boolean;
	/** 배송지 분리 여부 */
	hasSeparateShippingInfo?: boolean;
}

export interface StartPaymentOutput {
	/** 결제 트랜잭션 코드 (이 값을 CompletePayment에 전달해야한다) */
	transactionCode: string;
}

export interface Supplier {
	code?: string | null;
	name?: string | null;
	hasOptionWidget?: boolean;
	/** @format int32 */
	shippingFare?: number;
	/** @format int32 */
	freeShippingLimit?: number;
	useAdditionalFare?: boolean;
	additionalFares?: AdditionalShippingFare[] | null;
	optionWidgetType?: string | null;
	/** @format int32 */
	index?: number;
}

export interface Tag {
	/** @format int32 */
	id?: number;
	name?: string | null;
	/** @format int32 */
	productId?: number | null;
	product?: Product;
	/** @format int32 */
	index?: number;
}

export interface TagGroup {
	/** @format int32 */
	index?: number;
	name?: string | null;
	tags?: TagGroupTag[] | null;
}

export interface TagGroupTag {
	displayName?: string | null;
	tagName?: string | null;
}

export interface TaxBill {
	businessName?: string | null;
	businessNo?: string | null;
	representative?: string | null;
	businessType?: string | null;
	businessItem?: string | null;
	postalCode?: string | null;
	address1?: string | null;
	address2?: string | null;
	contact?: string | null;
	contactEmail?: string | null;
	contactPhoneNumber?: string | null;
}

export interface TokenOutput {
	result?: Result;
}

export interface UiElement {
	uiType?: UiElementType;
	text?: string | null;
	imageUrls?: string[] | null;
	position?: UiPosition;
	targetUrl?: string | null;
}

export enum UiElementType {
	Button = 'Button'
}

export interface UiPosition {
	/** @format int32 */
	x?: number;
	/** @format int32 */
	y?: number;
	/** @format int32 */
	width?: number;
	/** @format int32 */
	height?: number;
}

export interface UpdateCartItemParam {
	/** @format int32 */
	quantity?: number | null;
	/** @format int32 */
	pageCount?: number | null;
	/** @format int32 */
	variantId?: number | null;
	thumbnailUrl?: string | null;
	fileContents?: FileContentInput[] | null;
	title?: string | null;
	shippingAddress?: CartShippingAddress | null;
	bundledProducts?: CartBundledProduct[];
}

export interface UpdateExternalCartItemInput {
	externalOptionData?: string | null;
	/** @format int32 */
	quantity?: number | null;
	fileContents?: FileContentInput[] | null;
	thumbnailUrl?: string | null;
	/** @format int32 */
	pageCount?: number | null;
	title?: string | null;
}

export interface UploadImageOutput {
	fileName?: string | null;
	url?: string | null;
	/** @format int64 */
	fileSize?: number;
	/** @format int32 */
	width?: number;
	/** @format int32 */
	height?: number;
}

export interface UserInput {
	/**
	 * 멤버십 ID: null이면 디폴트
	 * @format int32
	 */
	membershipId?: number | null;
	/** Login ID */
	userName?: string | null;
	/** 회원 이름 */
	displayName?: string | null;
	/** 회원 별명 */
	nickname?: string | null;
	/** 비밀번호, 등록시에는 반드시 입력, 정보 변경시에는 null입력 가능(기존 비밀번호 유지) */
	password?: string | null;
	/** 광고성 Email 수신 여부 */
	isPromoEmailAllowed?: boolean;
	/** 광고성 문자 메시지 수신여부 */
	isPromoSmsAllowed?: boolean;
	/** Email 주소 */
	email?: string | null;
	/** 휴대폰 번호 */
	mobilePhoneNumber?: string | null;
	/** 인증 번호 (이전에 RequestVerificationCode를 해야 한다. 해당 Mall의 Policy에 따라 필요없을 수도 있음) */
	verificationCode?: string | null;
	/** 우편번호 */
	zipCode?: string | null;
	/** 주소1 */
	address1?: string | null;
	/** 주소2 */
	address2?: string | null;
	/** 일반 전화번호 */
	additionalPhoneNumber?: string | null;
	/** 회원 탈퇴 여부 (Admin만 사용가능) */
	unregister?: boolean;
	businessName?: string | null;
	businessNo?: string | null;
	businessRepre?: string | null;
	businessType?: string | null;
	businessItem?: string | null;
}

export enum UserType {
	Indivisual = 'Indivisual',
	Business = 'Business'
}

export interface VerificationCode {
	code?: string | null;
	key?: string | null;
	phoneNumber?: string | null;
	requestIpAddress?: string | null;
	/** @format date-time */
	issueDate?: string;
	/** @format date-time */
	validDate?: string;
	verificationUse?: VerificationUse;
	/** @format int32 */
	index?: number;
}

export interface BulkCartItemInput {
	productName: string;
	product: Product;
	quantity: number;
	bundledProducts?: ProductBundleProductOption[];
	shippingAddress: CartShippingAddress;
}

export interface VerificationCodeRequest {
	/** 인증코드를 받을 휴대폰 번호 */
	phoneNumber?: string | null;
}

export enum VerificationUse {
	FindUserId = 'FindUserId',
	ResetPassword = 'ResetPassword',
	Etc = 'Etc'
}

export interface MembershipEvaluationBaseAmount {
	startYear: number;
	startMonth: number;
	endYear: number;
	endMonth: number;
	/** 등급 평가 기준 기간 내의 주문 개수 */
	orderCount: number;
	/** 등급 평가 기준 기간 내의 주문 금액 */
	totalAmount: number;
}

export interface BoardComment {
	/** @format int32 */
	id?: number;
	/** @format int32 */
	boardPostId?: number;
	boardPost?: BoardPost;
	/** @format date-time */
	creationTime?: string;
	/** @format date-time */
	modificationTime?: string | null;
	authorGuid?: string | null;
	authorDisplayName?: string | null;
	authorIpAddress?: string | null;
	content?: string | null;
	attachments?: BoardPostAttachment[] | null;
	/** @format int32 */
	index?: number;
}

export interface BoardCommentInput {
	/** 게시자 Nickname, 지정하지 않으면 사용자 이름이 입력된다(게시물을 추가할 때만 사용). */
	authorDisplayName?: string | null;
	/** 코멘트 내용 */
	content?: string | null;
	/** 첨부 파일 */
	attachments?: BoardPostAttachment[] | null;
}

export interface X509Extension {
	critical?: boolean;
	/** @format byte */
	rawData?: string | null;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
	/** set parameter to `true` for call `securityWorker` for this request */
	secure?: boolean;
	/** request path */
	path: string;
	/** content type of request body */
	type?: ContentType;
	/** query params */
	query?: QueryParamsType;
	/** format of response (i.e. response.json() -> format: "json") */
	format?: ResponseFormat;
	/** request body */
	body?: unknown;
	/** base url */
	baseUrl?: string;
	/** request cancellation token */
	cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType> {
	baseUrl?: string;
	baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
	securityWorker?: (
		securityData: SecurityDataType | null
	) => Promise<RequestParams | void> | RequestParams | void;
	customFetch?: typeof fetch;
}

export interface HttpResponse<D, E> extends Response {
	data: D;
	error: E;
}

type CancelToken = symbol | string | number;

export enum ContentType {
	Json = 'application/json',
	FormData = 'multipart/form-data',
	UrlEncoded = 'application/x-www-form-urlencoded',
	Text = 'text/plain'
}

export class HttpClient<SecurityDataType> {
	public baseUrl = '';
	private securityData: SecurityDataType | null = null;
	private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
	private abortControllers = new Map<CancelToken, AbortController>();
	private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

	private baseApiParams: RequestParams = {
		credentials: 'include',
		headers: {},
		redirect: 'follow',
		referrerPolicy: 'no-referrer'
	};

	constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
		Object.assign(this, apiConfig);
	}

	public setSecurityData = (data: SecurityDataType | null) => {
		this.securityData = data;
	};

	protected encodeQueryParam(key: string, value: any) {
		const encodedKey = encodeURIComponent(key);
		return `${encodedKey}=${encodeURIComponent(
			typeof value === 'number' ? value : `${value}`
		)}`;
	}

	protected addQueryParam(query: QueryParamsType, key: string) {
		return this.encodeQueryParam(key, query[key]);
	}

	protected addArrayQueryParam(query: QueryParamsType, key: string) {
		const value = query[key];
		return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
	}

	protected toQueryString(rawQuery?: QueryParamsType): string {
		const query = rawQuery || {};
		const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
		return keys
			.map((key) =>
				Array.isArray(query[key])
					? this.addArrayQueryParam(query, key)
					: this.addQueryParam(query, key)
			)
			.join('&');
	}

	protected addQueryParams(rawQuery?: QueryParamsType): string {
		const queryString = this.toQueryString(rawQuery);
		return queryString ? `?${queryString}` : '';
	}

	private contentFormatters: Record<ContentType, (input: any) => any> = {
		[ContentType.Json]: (input: any) =>
			input !== null && (typeof input === 'object' || typeof input === 'string')
				? JSON.stringify(input)
				: input,
		[ContentType.Text]: (input: any) =>
			input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
		[ContentType.FormData]: (input: any) =>
			Object.keys(input || {}).reduce((formData, key) => {
				const property = input[key];
				formData.append(
					key,
					property instanceof Blob
						? property
						: typeof property === 'object' && property !== null
						? JSON.stringify(property)
						: `${property}`
				);
				return formData;
			}, new FormData()),
		[ContentType.UrlEncoded]: (input: any) => this.toQueryString(input)
	};

	protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
		return {
			...this.baseApiParams,
			...params1,
			...(params2 || {}),
			headers: {
				...(this.baseApiParams.headers || {}),
				...(params1.headers || {}),
				...((params2 && params2.headers) || {})
			}
		};
	}

	protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
		if (this.abortControllers.has(cancelToken)) {
			const abortController = this.abortControllers.get(cancelToken);
			if (abortController) {
				return abortController.signal;
			}
			return void 0;
		}

		const abortController = new AbortController();
		this.abortControllers.set(cancelToken, abortController);
		return abortController.signal;
	};

	public abortRequest = (cancelToken: CancelToken) => {
		const abortController = this.abortControllers.get(cancelToken);

		if (abortController) {
			abortController.abort();
			this.abortControllers.delete(cancelToken);
		}
	};

	public request = async <T = any, E = any>({
		body,
		secure,
		path,
		type,
		query,
		format,
		baseUrl,
		cancelToken,
		...params
	}: FullRequestParams): Promise<HttpResponse<T, E>> => {
		const secureParams =
			((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
				this.securityWorker &&
				(await this.securityWorker(this.securityData))) ||
			{};
		const requestParams = this.mergeRequestParams(params, secureParams);
		const queryString = query && this.toQueryString(query);
		const payloadFormatter = this.contentFormatters[type || ContentType.Json];
		const responseFormat = format || requestParams.format || 'json';

		const opt = {
			...requestParams,
			headers: {
				...(requestParams.headers || {}),
				...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {})
			},
			signal:
				(cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
			body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body)
		};

		return this.customFetch(
			`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
			opt
		).then(async (response) => {
			const r = response as HttpResponse<T, E>;
			r.data = null as unknown as T;
			r.error = null as unknown as E;

			const data = !responseFormat
				? r
				: await response[responseFormat]()
						.then((data) => {
							if (r.ok) {
								r.data = data;
							} else {
								r.error = data;
							}
							return r;
						})
						.catch((e) => {
							r.error = e;
							return r;
						});

			if (cancelToken) {
				this.abortControllers.delete(cancelToken);
			}

			if (!response.ok) throw data;
			return data;
		});
	};
}

/**
 * @title Shopicus
 * @version v1
 */
export class Api<SecurityDataType> extends HttpClient<SecurityDataType> {
	private static instance: Api<any> | null = null;
	accountApi = {
		/**
		 * No description
		 *
		 * @tags AccountApi
		 * @name createUser
		 * @summary 새로운 회원을 등록한다.
		 * @request POST:/AccountApi/Shop/RegisterUser
		 */
		createUser: (data: UserInput, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/AccountApi/Shop/RegisterUser`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags AccountApi
		 * @name ShopFindLoginIdCreate
		 * @summary 로그인 ID를 검색한다.
		 * @request POST:/AccountApi/Shop/FindLoginId
		 */
		shopFindLoginIdCreate: (data: AccountResetInfo, params: RequestParams = {}) =>
			this.request<FindLoginIdResult, any>({
				path: `/AccountApi/Shop/FindLoginId`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags AccountApi
		 * @name ShopResetPasswordCreate
		 * @summary 비밀번호를 리셋한다.
		 * @request POST:/AccountApi/Shop/ResetPassword
		 */
		shopResetPasswordCreate: (data: AccountResetInfo, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/AccountApi/Shop/ResetPassword`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags AccountApi
		 * @name getCurrentUserDetail
		 * @summary 현재 사용자의 자세한 정보를 얻는다
		 * @request GET:/AccountApi/Shop/CurrentUserDetail
		 */
		getCurrentUserDetail: (
			query?: {
				/**
				 * 외부 로그인 Provider를 통해 외부 계정의 상세정보를 얻어 Shopicus계정정보에 Merge한다
				 * @default false
				 */
				includeExtAccount?: boolean;
			},
			params: RequestParams = {}
		) =>
			this.request<ShopicusUser, any>({
				path: `/AccountApi/Shop/CurrentUserDetail`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags AccountApi
		 * @name updateUserInfo
		 * @summary 회원 정보를 변경한다.
		 * @request POST:/AccountApi/Shop/ChangeUserInfo
		 */
		updateUserInfo: (data: ShopUserInput, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/AccountApi/Shop/ChangeUserInfo`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'text',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags AccountApi
		 * @name ShopUnregisterUserCreate
		 * @summary 회원 탈퇴한다.
		 * @request POST:/AccountApi/Shop/UnregisterUser
		 */
		shopUnregisterUserCreate: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/AccountApi/Shop/UnregisterUser`,
				method: 'POST',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags AccountApi
		 * @name ChangePasswordCreate
		 * @summary 비밀번호를 변경한다.
		 * @request POST:/AccountApi/ChangePassword
		 */
		changePasswordCreate: (data: ChangePasswordInput, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/AccountApi/ChangePassword`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags AccountApi
		 * @name ShopUserProfileUpdate
		 * @summary 사용자 프로필 정보를 업데이트한다.
		 * @request PUT:/AccountApi/Shop/UserProfile
		 */
		shopUserProfileUpdate: (data: ShopUserProfile, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/AccountApi/Shop/UserProfile`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags AccountApi
		 * @name getCurrentUser
		 * @summary 로그인된 사용자의 기본 정보를 얻는다. (guid, name, email, role, loginProvider)
		 * @request GET:/AccountApi/CurrentUser
		 */
		getCurrentUser: (params: RequestParams = {}) =>
			this.request<ShopUser, ProblemDetails>({
				path: `/AccountApi/CurrentUser`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags AccountApi
		 * @name SignInCreate
		 * @summary Shiopicus에 로그인한다. (일반 유저만 가능, Admin은 로그인할 수 없음)
		 * @request POST:/AccountApi/SignIn
		 */
		signIn: (data: LoginForm, params: RequestParams = {}) =>
			this.request<ShopUser, SignInResult>({
				path: `/AccountApi/SignIn`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags AccountApi
		 * @name ExternalSignInCreate
		 * @summary 외부 로그인 인증이 성공한 사용자를 등록허거나 Shopicus에 로그인한다.
		 * @request POST:/AccountApi/ExternalSignIn
		 */
		externalSignInCreate: (data: ExternalLoginForm, params: RequestParams = {}) =>
			this.request<ShopUser, any>({
				path: `/AccountApi/ExternalSignIn`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags AccountApi
		 * @name logout
		 * @summary 로그아웃한다.
		 * @request POST:/AccountApi/SignOut
		 */
		logout: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/AccountApi/SignOut`,
				method: 'POST',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags AccountApi
		 * @name RemoteSignOutCreate
		 * @summary 이 브라우저 외의 다른 브라우저에 멀티 로그인된 사용자를 로그아웃한다.
		 * @request POST:/AccountApi/RemoteSignOut
		 */
		remoteSignOutCreate: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/AccountApi/RemoteSignOut`,
				method: 'POST',
				...params
			})
	};
	accountApi2 = {
		/**
		 * No description
		 *
		 * @tags AccountApi2
		 * @name getMembershipEvaluationBaseAmount
		 * @summary 등급 평가 기준 기간에 사용자가 발생시킨 매출 금액을 얻는다.
		 * @request GET:/AccountApi/MembershipEvaluationBaseAmount
		 */
		getMembershipEvaluationBaseAmount: (params: RequestParams = {}) =>
			this.request<MembershipEvaluationBaseAmount, any>({
				path: `/AccountApi/MembershipEvaluationBaseAmount`,
				method: 'GET',
				format: 'json',
				...params
			})
	};
	boardApi = {
		/**
		 * No description
		 *
		 * @tags BoardApi
		 * @name ShopBoardsList
		 * @summary 게시판 정보를 얻는다.
		 * @request GET:/BoardApi/Shop/Boards
		 */
		shopBoardsList: (
			query?: {
				boardCode?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<Board, any>({
				path: `/BoardApi/Shop/Boards`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags BoardApi
		 * @name ShopPostsList
		 * @summary 게시판의 게시물 목록을 얻는다. (타입 상관 없음)
		 * @request GET:/BoardApi/Shop/Posts
		 */
		shopPostsList: (
			query?: {
				/** 게시판 코드 */
				boardCode?: string;
				/**
				 * 게시글 목록에 게시글 내용까지 포함한다.
				 * @default false
				 */
				includeContent?: boolean;
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<BoardPostODataList, any>({
				path: `/BoardApi/Shop/Posts`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags BoardApi
		 * @name ShopPostsCreate
		 * @summary 게시글을 등록한다.
		 * @request POST:/BoardApi/Shop/Posts
		 */
		shopPostsCreate: (data: ShopBoardPostInput, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/BoardApi/Shop/Posts`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags BoardApi
		 * @name ShopEventPostsList
		 * @summary 이벤트 게시판의 게시물 목록을 얻는다.
		 * @request GET:/BoardApi/Shop/EventPosts
		 */
		shopEventPostsList: (
			query?: {
				/** 게시판 코드(이벤트 타입만 가능) */
				boardCode?: string;
				/** All, InProgress(진행중), NotInProgress(진행중이지 않음) */
				query?: EventBoardQuery;
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<BoardPostODataList, any>({
				path: `/BoardApi/Shop/EventPosts`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags BoardApi
		 * @name ShopPostsDetail
		 * @summary 게시판의 게시글 내용을 얻는다..
		 * @request GET:/BoardApi/Shop/Posts/{postId}
		 */
		shopPostsDetail: (postId: number, params: RequestParams = {}) =>
			this.request<BoardPost, any>({
				path: `/BoardApi/Shop/Posts/${postId}`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags BoardApi
		 * @name ShopPostsUpdate
		 * @summary 게시글을 수정한다.
		 * @request PUT:/BoardApi/Shop/Posts/{postId}
		 */
		shopPostsUpdate: (postId: number, data: ShopBoardPostInput, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/BoardApi/Shop/Posts/${postId}`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags BoardApi
		 * @name ShopPostsDelete
		 * @summary 게시물을 삭제한다.
		 * @request DELETE:/BoardApi/Shop/Posts/{postId}
		 */
		shopPostsDelete: (postId: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/BoardApi/Shop/Posts/${postId}`,
				method: 'DELETE',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags BoardApi
		 * @name ShopFaqsList
		 * @summary FAQ 목록을 얻는다.
		 * @request GET:/BoardApi/Shop/Faqs
		 */
		shopFaqsList: (
			query?: {
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<FaqODataList, any>({
				path: `/BoardApi/Shop/Faqs`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags BoardApi
		 * @name ShopFaqsDetail
		 * @summary FAQ 항목을 얻는다.
		 * @request GET:/BoardApi/Shop/Faqs/{id}
		 */
		shopFaqsDetail: (id: number, params: RequestParams = {}) =>
			this.request<Faq, any>({
				path: `/BoardApi/Shop/Faqs/${id}`,
				method: 'GET',
				format: 'json',
				...params
			}),
		/**
		 * No description
		 *
		 * @tags BoardApi
		 * @name getComments
		 * @summary 게시판 댓글을 얻어온다.
		 * @request GET:/BoardApi/Shop/Posts/{PostId}/Comments
		 */
		getComments: (postId: number, params: RequestParams = {}) =>
			this.request<BoardComment[], any>({
				path: `/BoardApi/Shop/Posts/${postId}/Comments`,
				method: 'GET',
				format: 'json',
				...params
			}),
		/**
		 * No description
		 *
		 * @tags BoardApi
		 * @name createComment
		 * @summary 게시물에 Comment를 추가한다.
		 * @request POST:/BoardApi/Shop/Posts/{postId}/Comments
		 */
		createComment: (postId: number, data: BoardCommentInput, params: RequestParams = {}) =>
			this.request<BoardComment, any>({
				path: `/BoardApi/Shop/Posts/${postId}/Comments`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags BoardApi
		 * @name updateComment
		 * @summary 게시물 Comment를 Update한다.
		 * @request PUT:/BoardApi/Shop/Comments/{commentId}
		 */
		updateComment: (commentId: number, data: BoardCommentInput, params: RequestParams = {}) =>
			this.request<BoardComment, any>({
				path: `/BoardApi/Shop/Comments/${commentId}`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags BoardApi
		 * @name deleteComment
		 * @summary 게시물 Comment를 삭제한다.
		 * @request DELETE:/BoardApi/Shop/Comments/{commentId}
		 */
		deleteComment: (commentId: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/BoardApi/Shop/Comments/${commentId}`,
				method: 'DELETE',
				...params
			})
	};
	edicusApi = {
		/**
		 * No description
		 *
		 * @tags EdicusApi
		 * @name getToken
		 * @summary Edicus Custom Token을 얻는다.
		 * @request GET:/EdicusApi/Token
		 */
		getToken: (
			query?: {
				uid?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<string, any>({
				path: `/EdicusApi/Token`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags EdicusApi
		 * @name CloneProjectCreate
		 * @summary Project를 복사한다.
		 * @request POST:/EdicusApi/CloneProject
		 */
		cloneProjectCreate: (
			query?: {
				projectId?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<void, any>({
				path: `/EdicusApi/CloneProject`,
				method: 'POST',
				query: query,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags EdicusApi
		 * @name getProjectThumbnails
		 * @summary 프로젝트의 Thumbnail을 얻는다.
		 * @request GET:/EdicusApi/Projects/{projectId}/Thumbnail
		 */
		getProjectThumbnails: (projectId: string, params: RequestParams = {}) =>
			this.request<GetThumbnailsOutput, any>({
				path: `/EdicusApi/Projects/${projectId}/Thumbnail`,
				method: 'GET',
				format: 'json',
				...params
			})
	};
	mallApi = {
		/**
		 * No description
		 *
		 * @tags MallApi
		 * @name ShopContractList
		 * @summary 사이트의 약관 / 개인정보처리방침을 얻는다.
		 * @request GET:/MallApi/Shop/Contract
		 */
		shopContractList: (
			query?: {
				type?: ContractType;
			},
			params: RequestParams = {}
		) =>
			this.request<Contract, any>({
				path: `/MallApi/Shop/Contract`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			})
	};
	messageApi = {
		/**
		 * No description
		 *
		 * @tags MessageApi
		 * @name getVerificationCode
		 * @summary 휴대폰으로 인증코드를 요청한다.
		 * @request POST:/MessageApi/Shop/RequestVerificationCode
		 */
		getVerificationCode: (data: VerificationCodeRequest, params: RequestParams = {}) =>
			this.request<VerificationCode, any>({
				path: `/MessageApi/Shop/RequestVerificationCode`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags MessageApi
		 * @name checkVerificationCode
		 * @summary 인증코드가 맞는지 확인한다.
		 * @request POST:/MessageApi/Shop/CheckVerificationCode
		 */
		checkVerificationCode: (data: CheckVerificationCodeRequest, params: RequestParams = {}) =>
			this.request<VerificationCode, any>({
				path: `/MessageApi/Shop/CheckVerificationCode`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			})
	};
	orderApi = {
		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name getCartCodeList
		 * @summary 장바구니의 CartCode 목록을 얻는다.
		 * @request GET:/OrderApi/CartCodes
		 */
		getCartCodeList: (params: RequestParams = {}) =>
			this.request<string[], ProblemDetails>({
				path: `/OrderApi/CartCodes`,
				method: 'GET',
				...params
			}),
		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name ShopReduceProductStockCreate
		 * @summary 상품의 재고를 감소시킨다.
		 * @request POST:/OrderApi/Shop/ReduceProductStock
		 */
		shopReduceProductStockCreate: (
			query?: {
				/**
				 * 상품 ID
				 * @format int32
				 */
				productId?: number;
			},
			params: RequestParams = {}
		) =>
			this.request<void, ProblemDetails>({
				path: `/OrderApi/Shop/ReduceProductStock`,
				method: 'POST',
				query: query,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name addCart
		 * @summary 장바구니에 상품을 넣는다.
		 * @request POST:/OrderApi/Cart
		 */
		addCart: (
			data: CartItemInput,
			query?: {
				/**
				 * 장바구니 코드. 임의로 정한 문자열(장바구니를 여러개(보관함 등) 사용할 때 구분하기 위한 용도로 사용), 생략하거나 empty스트링이면 기본 장바구니
				 * @default ""
				 */
				cartCode?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<CartItem, ProblemDetails>({
				path: `/OrderApi/Cart`,
				method: 'POST',
				query: query,
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name getCartList
		 * @summary 장바구니 내의 모든 상품 정보를 얻는다.
		 * @request GET:/OrderApi/Cart
		 */
		getCartList: (
			query?: {
				/**
				 * 상품정보를 얻을 장바구니 코드(생략하거나 Empty string이면 기본 장바구니)
				 * @default ""
				 */
				cartCode?: string;
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<{ count: number; result: CartItemViewModel[] }, ProblemDetails>({
				path: `/OrderApi/Cart`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name addBulkCart
		 * @summary 장바구니에 상품을 여러개 넣는다.
		 * @request POST:/OrderApi/CartMultiple
		 */
		addBulkCart: (
			data: CartItemInput[],
			query?: {
				/**
				 * 장바구니 코드. 임의로 정한 문자열(장바구니를 여러개(보관함 등) 사용할 때 구분하기 위한 용도로 사용), 생략하거나 empty스트링이면 기본 장바구니
				 * @default ""
				 */
				cartCode?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<number[], ProblemDetails>({
				path: `/OrderApi/CartMultiple`,
				method: 'POST',
				query: query,
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name ExtCartRedprintingCreate
		 * @summary 외부 옵션을 사용하는 상품을 장바구니에 넣는다.
		 * @request POST:/OrderApi/ExtCart/Redprinting
		 */
		extCartRedprintingCreate: (
			data: ExternalCartItemInput,
			query?: {
				/**
				 * 장바구니 코드. 임의로 정한 문자열(장바구니를 여러개(보관함 등) 사용할 때 구분하기 위한 용도로 사용), 생략하거나 empty스트링이면 기본 장바구니
				 * @default ""
				 */
				cartCode?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<CartItem, ProblemDetails>({
				path: `/OrderApi/ExtCart/Redprinting`,
				method: 'POST',
				query: query,
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name ExtCartV2Create
		 * @summary 외부 옵션을 사용하는 상품을 장바구니에 넣는다.
		 * @request POST:/OrderApi/ExtCart/v2
		 */
		extCartV2Create: (
			data: ExternalCartItemInput,
			query?: {
				/**
				 * 장바구니 코드. 임의로 정한 문자열(장바구니를 여러개(보관함 등) 사용할 때 구분하기 위한 용도로 사용), 생략하거나 empty스트링이면 기본 장바구니
				 * @default ""
				 */
				cartCode?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<CartItem, ProblemDetails>({
				path: `/OrderApi/ExtCart/v2`,
				method: 'POST',
				query: query,
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * @description 장바구니 코드는 사용하지 않는다. cartItemId가 장바구니 종류에 상관없이 유일하기 때문
		 *
		 * @tags OrderApi
		 * @name ExtCartRedprintingUpdate
		 * @summary 외부 옵션 상품 장바구니 항목을 갱신한다.
		 * @request PUT:/OrderApi/ExtCart/Redprinting/{cartItemId}
		 */
		extCartRedprintingUpdate: (
			cartItemId: number,
			data: UpdateExternalCartItemInput,
			params: RequestParams = {}
		) =>
			this.request<CartItemViewModel, ApiError | ProblemDetails>({
				path: `/OrderApi/ExtCart/Redprinting/${cartItemId}`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * @description 장바구니 코드는 사용하지 않는다. cartItemId가 장바구니 종류에 상관없이 유일하기 때문
		 *
		 * @tags OrderApi
		 * @name ExtCartV2Update
		 * @summary 외부 옵션 상품 장바구니 항목을 갱신한다.
		 * @request PUT:/OrderApi/ExtCart/v2/{cartItemId}
		 */
		extCartV2Update: (
			cartItemId: number,
			data: UpdateExternalCartItemInput,
			params: RequestParams = {}
		) =>
			this.request<CartItemViewModel, ApiError | ProblemDetails>({
				path: `/OrderApi/ExtCart/v2/${cartItemId}`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name ExtCartCreate
		 * @summary 외부 옵션정보를 포함하는 상품을 장바구니에 넣는다.
		 * @request POST:/OrderApi/ExtCart
		 * @deprecated
		 */
		extCartCreate: (
			data: ExternalCartItemInput,
			query?: {
				/**
				 * 장바구니 코드. 임의로 정한 문자열(장바구니를 여러개(보관함 등) 사용할 때 구분하기 위한 용도로 사용), 생략하거나 empty스트링이면 기본 장바구니
				 * @default ""
				 */
				cartCode?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<CartItem, ProblemDetails>({
				path: `/OrderApi/ExtCart`,
				method: 'POST',
				query: query,
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name ShopCartDetail
		 * @summary 장바구니 상품 정보를 얻는다.
		 * @request GET:/OrderApi/Shop/Cart/{cartItemId}
		 */
		shopCartDetail: (cartItemId: number, params: RequestParams = {}) =>
			this.request<CartItemViewModel, ProblemDetails>({
				path: `/OrderApi/Shop/Cart/${cartItemId}`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * @description param으로 empty object를 넘기면 아무것도 변경하지 않고 Modification만 현재날짜로 갱신한다(Touch)
		 *
		 * @tags OrderApi
		 * @name updateCart
		 * @summary 장바구니 항목을 갱신한다.
		 * @request PUT:/OrderApi/Cart/{cartItemId}
		 */
		updateCart: (cartItemId: number, data: UpdateCartItemParam, params: RequestParams = {}) =>
			this.request<CartItemViewModel, ApiError | ProblemDetails>({
				path: `/OrderApi/Cart/${cartItemId}`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * @description 장바구니 코드는 사용하지 않는다. cartItemId가 장바구니 종류에 상관없이 유일하기 때문
		 *
		 * @tags OrderApi
		 * @name removeCartItem
		 * @summary 장바구니 항목을 삭제한다.
		 * @request DELETE:/OrderApi/Cart/{cartItemId}
		 */
		removeCartItem: (cartItemId: number, params: RequestParams = {}) =>
			this.request<void, ApiError | ProblemDetails>({
				path: `/OrderApi/Cart/${cartItemId}`,
				method: 'DELETE',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name MoveCartItemsCreate
		 * @summary 장바구니 항목을 다른 장바구니로 이동한다.
		 * @request POST:/OrderApi/MoveCartItems
		 */
		moveCartItemsCreate: (data: MoveCartItemsInput, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/OrderApi/MoveCartItems`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name SetCartItemStatusCreate
		 * @summary 장바구니 항목의 Status를 변경한다.
		 * @request POST:/OrderApi/SetCartItemStatus
		 */
		setCartItemStatusCreate: (data: SetCartItemStatusInput, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/OrderApi/SetCartItemStatus`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name CountCartItemsList
		 * @summary 장바구니 항목을 Status로 그룹핑해 개수를 알려준다.
		 * @request GET:/OrderApi/CountCartItems
		 */
		countCartItemsList: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/OrderApi/CountCartItems`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name PrepareCartItemShareCreate
		 * @summary 장바구니 항목 공유를 위한 Share Code를 발급받는다.
		 * @request POST:/OrderApi/PrepareCartItemShare/{cartItemId}
		 */
		prepareCartItemShareCreate: (cartItemId: number, params: RequestParams = {}) =>
			this.request<PrepareShareCartItemOutput, any>({
				path: `/OrderApi/PrepareCartItemShare/${cartItemId}`,
				method: 'POST',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name ShareCartItemCreate
		 * @summary 장바구니 항목을 공유한다.
		 * @request POST:/OrderApi/ShareCartItem
		 */
		shareCartItemCreate: (data: ShareCartItemInput, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/OrderApi/ShareCartItem`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name CancelCartItemSharingCreate
		 * @summary 장바구니 항목의 공유를 취소한다.
		 * @request POST:/OrderApi/CancelCartItemSharing
		 */
		cancelCartItemSharingCreate: (
			query?: {
				/** @format int32 */
				cartItemId?: number;
			},
			params: RequestParams = {}
		) =>
			this.request<void, any>({
				path: `/OrderApi/CancelCartItemSharing`,
				method: 'POST',
				query: query,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name CopySharedCartItemCreate
		 * @summary 공유된 장바구니 항목을 내 장바구니로 복사한다.
		 * @request POST:/OrderApi/CopySharedCartItem
		 */
		copySharedCartItemCreate: (data: CopySharedCartItemInput, params: RequestParams = {}) =>
			this.request<CartItemViewModel, any>({
				path: `/OrderApi/CopySharedCartItem`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name CloneCartItemCreate
		 * @summary 내 장바구니 항목을 복사(Clone)해 내 장바구니로 넣는다.
		 * @request POST:/OrderApi/CloneCartItem
		 */
		cloneCartItemCreate: (data: CloneCartItemInput, params: RequestParams = {}) =>
			this.request<CartItem, any>({
				path: `/OrderApi/CloneCartItem`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name BankTransferAccountsList
		 * @summary 무통장 입금 가능한 계좌번호 정보를 얻는다.
		 * @request GET:/OrderApi/BankTransferAccounts
		 */
		bankTransferAccountsList: (params: RequestParams = {}) =>
			this.request<BankAccountInfo[], any>({
				path: `/OrderApi/BankTransferAccounts`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name getBill
		 * @summary 계산서를 발행한다. 주문을 시작하기 전에 이 API를 호출해 계산서를 발급받아 사용자에게 보여준다.
		 * @request POST:/OrderApi/CalculateBill
		 */
		getBill: (data: BillInput, params: RequestParams = {}) =>
			this.request<Bill, any>({
				path: `/OrderApi/CalculateBill`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name CanOrderCreate
		 * @summary 주문 가능 여부를 파악한다. (실제 주문전에 이 API를 불러서 현재 시점의 주문 가능여부를 체크한다)
		 * @request POST:/OrderApi/CanOrder
		 */
		canOrderCreate: (data: CanOrderInput, params: RequestParams = {}) =>
			this.request<CanOrderOutput, any>({
				path: `/OrderApi/CanOrder`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name startPayment
		 * @summary 결제 과정을 시작한다. PG사 UI를 부르기 전에 먼저 호출해야 한다. PG가 사용되지 않는 결제도 호출해야 한다.
		 * @request POST:/OrderApi/StartPayment
		 */
		startPayment: (data: StartPaymentInput, params: RequestParams = {}) =>
			this.request<StartPaymentOutput, any>({
				path: `/OrderApi/StartPayment`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name complatePayment
		 * @summary 결제 과정을 종료한다. PG가 필요하지 않은 결제는 StartPayment직후 바로 CompletePayment를 불러야 한다.
		 * @request POST:/OrderApi/CompletePayment
		 */
		complatePayment: (data: CompletePaymentInput, params: RequestParams = {}) =>
			this.request<CompletePaymentOutput, any>({
				path: `/OrderApi/CompletePayment`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			})
	};
	orderApi2 = {
		/**
		 * No description
		 *
		 * @tags OrderApi2
		 * @name getBulkProductsWithExcel
		 * @summary 빠른 파일 제작 엑셀 양식
		 * @request GET:/OrderApi/CartCodes
		 */
		getBulkProductsWithExcel: (data: { file: File }, params: RequestParams = {}) =>
			this.request<BulkCartItemInput[], any>({
				path: `/OrderApi/ParseCartInputExcel`,
				method: 'POST',
				query: {
					format: 'husk'
				},
				body: data,
				type: ContentType.FormData,
				format: 'json',
				...params
			})
		/**
		 * No description
		 *
		 * @tags OrderApi
		 * @name ShopReduceProductStockCreate
		 * @summary 상품의 재고를 감소시킨다.
		 * @request POST:/OrderApi/Shop/ReduceProductStock
		 */
	};
	orderManageApi = {
		/**
		 * No description
		 *
		 * @tags OrderManage2Api
		 * @name ShopListOrderItemStatusCreate
		 * @summary 주문 항목의 상태를 얻는다.
		 * @request POST:/OrderManageApi/Shop/ListOrderItemStatus
		 */
		shopListOrderItemStatusCreate: (data: number[], params: RequestParams = {}) =>
			this.request<ShopOrderItemStatus[], any>({
				path: `/OrderManageApi/Shop/ListOrderItemStatus`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderManageApi
		 * @name ShopOrdersList
		 * @summary 현재 로그인한 사용자의 모든 주문목록을 얻는다.
		 * @request GET:/OrderManageApi/Shop/Orders
		 */
		shopOrdersList: (
			query?: {
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<SimpleOrderODataList, any>({
				path: `/OrderManageApi/Shop/Orders`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderManageApi
		 * @name ShopOrdersDetail
		 * @summary 자세한 주문 내용을 얻는다.
		 * @request GET:/OrderManageApi/Shop/Orders/{orderId}
		 */
		shopOrdersDetail: (orderId: number, params: RequestParams = {}) =>
			this.request<Order, any>({
				path: `/OrderManageApi/Shop/Orders/${orderId}`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderManageApi
		 * @name ShopGetShopOrderByEncOrderIdList
		 * @summary 자세한 주문 내용을 얻는다.(OrderId 암호화 버전)
		 * @request GET:/OrderManageApi/Shop/GetShopOrderByEncOrderId
		 */
		shopGetShopOrderByEncOrderIdList: (
			query?: {
				/** Encrypted Order Id */
				encOrderId?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<Order, any>({
				path: `/OrderManageApi/Shop/GetShopOrderByEncOrderId`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderManageApi
		 * @name ShopOrderSummaryList
		 * @summary 현재 사용자의 주문 요약 내용을 얻는다.
		 * @request GET:/OrderManageApi/Shop/OrderSummary
		 */
		shopOrderSummaryList: (
			query?: {
				/** 상품 후기 게시판 코드 */
				reviewBoardCode?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<OrderSummary, any>({
				path: `/OrderManageApi/Shop/OrderSummary`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderManageApi
		 * @name ShopReviewableOrderItemsList
		 * @summary 현재 로그인한 사용자의 후기 쓰기가 가능한 주문항목목록을 얻는다.
		 * @request GET:/OrderManageApi/Shop/ReviewableOrderItems
		 */
		shopReviewableOrderItemsList: (
			query?: {
				/** 후기 게시판 Code */
				reviewBoardCode?: string;
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<OrderItemODataList, any>({
				path: `/OrderManageApi/Shop/ReviewableOrderItems`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderManageApi
		 * @name ShopOrderCountsByStatusList
		 * @summary 현재 사용자의 주문을 주문상태로 그룹핑해 개수를 알려준다.
		 * @request GET:/OrderManageApi/Shop/OrderCountsByStatus
		 */
		shopOrderCountsByStatusList: (
			query?: {
				/**
				 * 지정한 날부터 오늘까지의 주문을 기준
				 * @format int32
				 */
				days?: number;
				/**
				 * 주문취소 등의 클레임상태도 카운트할 것인지 여부(true/false)
				 * @default false
				 */
				claimStatus?: boolean;
			},
			params: RequestParams = {}
		) =>
			this.request<ShopOrderStatusCount, any>({
				path: `/OrderManageApi/Shop/OrderCountsByStatus`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderManageApi
		 * @name ShopShippingCompleteCreate
		 * @summary 구매 확정한다.
		 * @request POST:/OrderManageApi/Shop/ShippingComplete
		 */
		shopShippingCompleteCreate: (data: ShippingCompleteInput, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/OrderManageApi/Shop/ShippingComplete`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderManageApi
		 * @name AllCancellationReasonsList
		 * @summary 주문 취소 사유 목록을 얻는다.
		 * @request GET:/OrderManageApi/AllCancellationReasons
		 */
		allCancellationReasonsList: (params: RequestParams = {}) =>
			this.request<CancellationReasonStringKeyValuePair[], any>({
				path: `/OrderManageApi/AllCancellationReasons`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderManageApi
		 * @name ShopClaimsList
		 * @summary 사용자의 취소/환불/교환 목록을 얻는다.
		 * @request GET:/OrderManageApi/Shop/Claims
		 */
		shopClaimsList: (
			query?: {
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<CancellationODataList, any>({
				path: `/OrderManageApi/Shop/Claims`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderManageApi
		 * @name ShopRewardPointsHistoryList
		 * @summary 적립금 적립/사용 내역을 얻는다.
		 * @request GET:/OrderManageApi/Shop/RewardPointsHistory
		 */
		shopRewardPointsHistoryList: (
			query?: {
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<RewardPointsHistoryODataList, any>({
				path: `/OrderManageApi/Shop/RewardPointsHistory`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags OrderManageApi
		 * @name ShopCancelEntireOrderCreate
		 * @summary 주문 전체를 취소한다.(결제 전 취소, 결제 후 취소 모두 가능)
		 * @request POST:/OrderManageApi/Shop/CancelEntireOrder/{orderId}
		 */
		shopCancelEntireOrderCreate: (
			orderId: number,
			data: ShopCancelInput,
			params: RequestParams = {}
		) =>
			this.request<void, ApiError>({
				path: `/OrderManageApi/Shop/CancelEntireOrder/${orderId}`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			})
	};
	productApi = {
		/**
		 * @description <b>상품 정렬 순서</b> <br /> $orderby=XXXX로 지정가능<br /> 1. 최신순 - Id desc<br /> 2. 사용자가 변경가능한 최신 순 - SortOrder desc<br /> 3. 인기순 - Popularity desc, Id desc<br /> 4. 이름순 - Name<br />
		 *
		 * @tags ProductApi
		 * @name getProductList
		 * @summary Product 목록을 보야준다.
		 * @request GET:/ProductApi/Shop/Products
		 */
		getProductList: (
			query?: {
				/**
				 * 카테고리 User Code<br />
				 * 카테고리 등록할 때 관리자가 지정한 Code값으로 상위 카테고리 코드도 허용<br />
				 * Cannot be null
				 */
				categoryUserCode?: string;
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<ShopProductDataList, any>({
				path: `/ProductApi/Shop/Products`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags ProductApi
		 * @name getProductsByCategoryId
		 * @summary Product 목록을 보야준다.
		 * @request GET:/ProductApi/Shop/ProductsByCategoryId
		 */
		getProductsByCategoryId: (
			query?: {
				/**
				 * 카테고리 ID
				 * @format int32
				 */
				categoryId?: number;
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<ShopProductDataList, any>({
				path: `/ProductApi/Shop/ProductsByCategoryId`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags ProductApi
		 * @name getProductDetail
		 * @summary Product 개별 정보를 얻는다.
		 * @request GET:/ProductApi/Shop/Products/{productId}
		 */
		getProductsDetail: (productId: number, params: RequestParams = {}) =>
			this.request<Product, any>({
				path: `/ProductApi/Shop/Products/${productId}`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags ProductApi
		 * @name ShopVariantImagesDetail
		 * @summary Product Variant Image 정보를 얻는다.
		 * @request GET:/ProductApi/Shop/VariantImages/{variantId}
		 */
		shopVariantImagesDetail: (variantId: number, params: RequestParams = {}) =>
			this.request<ProductImage[], any>({
				path: `/ProductApi/Shop/VariantImages/${variantId}`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags ProductApi
		 * @name QueryExternalOptionParamsCreate
		 * @summary External Option Data에 따른 가격, Edicus 파라미터를 얻는다.
		 * @request POST:/ProductApi/QueryExternalOptionParams
		 * @deprecated
		 */
		queryExternalOptionParamsCreate: (
			data: ProductExtOptionQueryInput,
			params: RequestParams = {}
		) =>
			this.request<ProductOptionQueryResult, any>({
				path: `/ProductApi/QueryExternalOptionParams`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags ProductApi
		 * @name QueryExternalOptionParamsExCreate
		 * @request POST:/ProductApi/QueryExternalOptionParamsEx
		 */
		queryExternalOptionParamsExCreate: (
			data: ProductExtOptionQueryExInput,
			params: RequestParams = {}
		) =>
			this.request<ProductOptionQueryResult, any>({
				path: `/ProductApi/QueryExternalOptionParamsEx`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags ProductApi
		 * @name getCategories
		 * @summary Category 정보를 얻는다. 메뉴 구성할 떄 사용한다.
		 * @request GET:/ProductApi/Shop/Categories
		 */
		getCategories: (
			query?: {
				/** @default false */
				includeNonActive?: boolean;
			},
			params: RequestParams = {}
		) =>
			this.request<ShopCategory[], any>({
				path: `/ProductApi/Shop/Categories`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags ProductApi
		 * @name getCategoriesFrom
		 * @summary 특정 코드 하위의 Category 정보를 얻는다. 메뉴 구성할 떄 사용한다.
		 * @request GET:/ProductApi/Shop/CategoriesFrom
		 */
		getCategoriesFrom: (
			query?: {
				/** Root Category Code */
				rootCategoryCode?: number;
			},
			params: RequestParams = {}
		) =>
			this.request<ShopCategory[], any>({
				path: `/ProductApi/Shop/CategoriesFrom`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			})
	};
	productDataApi = {
		/**
		 * No description
		 *
		 * @tags ProductDataApi
		 * @name getCategoryDetail
		 * @summary 카테고리의 세부 설명을 얻는다.
		 * @request GET:/ProductDataApi/Shop/CategoryDetails/{categoryId}
		 */
		getCategoryDetail: (categoryId: number, params: RequestParams = {}) =>
			this.request<ProductDescription[], any>({
				path: `/ProductDataApi/Shop/CategoryDetails/${categoryId}`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags ProductDataApi
		 * @name ShopShowcasesList
		 * @summary code로 지정한 특정 쇼케이스를 얻는다.
		 * @request GET:/ProductDataApi/Shop/Showcases
		 */
		shopShowcasesList: (
			query?: {
				/** 쇼케이스 코드 */
				code?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<ShowcaseCategory[], any>({
				path: `/ProductDataApi/Shop/Showcases`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			})
	};
	promoApi = {
		/**
		 * No description
		 *
		 * @tags PromoApi
		 * @name ShopCouponTemplatesDetail
		 * @summary 쿠폰 탬플릿의 상세정보를 얻는다.
		 * @request GET:/PromoApi/Shop/CouponTemplates/{id}
		 */
		shopCouponTemplatesDetail: (id: number, params: RequestParams = {}) =>
			this.request<CouponTemplate, any>({
				path: `/PromoApi/Shop/CouponTemplates/${id}`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags PromoApi
		 * @name ShopDownloadableCouponsList
		 * @summary 현재 다운로드 가능한 쿠폰 목록을 얻는다.
		 * @request GET:/PromoApi/Shop/DownloadableCoupons
		 */
		shopDownloadableCouponsList: (
			query?: {
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<CouponTemplateODataList, any>({
				path: `/PromoApi/Shop/DownloadableCoupons`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags PromoApi
		 * @name ShopDownloadCouponCreate
		 * @summary 쿠폰을 다운로드해 현재 로그인한 사용자의 쿠폰함에 넣는다.
		 * @request POST:/PromoApi/Shop/DownloadCoupon
		 */
		shopDownloadCouponCreate: (data: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/PromoApi/Shop/DownloadCoupon`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags PromoApi
		 * @name ShopExhibitionsList
		 * @summary 기획전/이벤트 목록을 얻는다.
		 * @request GET:/PromoApi/Shop/Exhibitions
		 */
		shopExhibitionsList: (
			query?: {
				/** true: 진행중, false: 진행하지 않음, 없으면: 모든 목록 */
				isOnGoing?: boolean;
				/** 타입(Exhibition-기획전, Event-이벤트) */
				type?: ExhibitionType;
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<ExhibitionODataList, any>({
				path: `/PromoApi/Shop/Exhibitions`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags PromoApi
		 * @name ShopExhibitionsDetail
		 * @summary 기획전/이벤트 내용을 얻는다.
		 * @request GET:/PromoApi/Shop/Exhibitions/{id}
		 */
		shopExhibitionsDetail: (
			id: number,
			query?: {
				type?: ExhibitionType;
			},
			params: RequestParams = {}
		) =>
			this.request<ShopExhibition, any>({
				path: `/PromoApi/Shop/Exhibitions/${id}`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			})
	};
	redprintingApi = {
		/**
		 * No description
		 *
		 * @tags RedprintingApi
		 * @name TokenList
		 * @summary Redprinting Custom Token을 얻는다.
		 * @request GET:/RedprintingApi/Token
		 */
		tokenList: (params: RequestParams = {}) =>
			this.request<TokenOutput, any>({
				path: `/RedprintingApi/Token`,
				method: 'GET',
				format: 'json',
				...params
			})
	};
	reportApi = {
		/**
		 * No description
		 *
		 * @tags ReportApi
		 * @name ShopBestSellerList
		 * @summary Best Seller 카테고리/상품 리스트를 얻는다.(오늘부터 특정 일수 동안 가장 많이 팔린 상품 카테고리)
		 * @request GET:/ReportApi/Shop/BestSeller
		 */
		shopBestSellerList: (
			query?: {
				/**
				 * Best Seller를 선정할 일수
				 * @format int32
				 * @default 7
				 */
				days?: number;
				/**
				 * 최대 Best Seller 카테고리 개수
				 * @format int32
				 * @default 10
				 */
				categoryLimit?: number;
			},
			params: RequestParams = {}
		) =>
			this.request<BestSeller[], any>({
				path: `/ReportApi/Shop/BestSeller`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags ReportApi
		 * @name ShopBestSellerCategoriesDetail
		 * @summary 특정 카테고리의 Best Seller 상품 리스트를 얻는다.(특정일동안 가장 많이 팔린 상품)
		 * @request GET:/ReportApi/Shop/BestSeller/Categories/{categoryUserCode}
		 */
		shopBestSellerCategoriesDetail: (
			categoryUserCode: string,
			query?: {
				/**
				 * Best Seller를 선정할 일수
				 * @format int32
				 * @default 7
				 */
				days?: number;
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<ProductODataList, any>({
				path: `/ReportApi/Shop/BestSeller/Categories/${categoryUserCode}`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			})
	};
	settingsApi = {
		/**
		 * No description
		 *
		 * @tags SettingsApi
		 * @name ShopFaqCategoriesList
		 * @summary FAQ 개시판의 구분 값의 Code와 DisplayName을 얻는다.
		 * @request GET:/SettingsApi/Shop/FaqCategories
		 */
		shopFaqCategoriesList: (params: RequestParams = {}) =>
			this.request<ShopCode[], any>({
				path: `/SettingsApi/Shop/FaqCategories`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags SettingsApi
		 * @name ShopPaymentSettingsList
		 * @summary 결제관련 필요 정보를 얻는다.
		 * @request GET:/SettingsApi/Shop/PaymentSettings
		 */
		shopPaymentSettingsList: (params: RequestParams = {}) =>
			this.request<ShopPaymentSettings, any>({
				path: `/SettingsApi/Shop/PaymentSettings`,
				method: 'GET',
				format: 'json',
				...params
			})
	};
	siteDesignApi = {
		/**
		 * No description
		 *
		 * @tags SiteDesignApi
		 * @name ShopRotatingBannersDetail
		 * @summary Rotating Banner리스트를 얻는다. 관리자가 선택한 옵션을 모두 고려해 현 상황에 디스플레이애야 할 배너리스트만을 얻는다.
		 * @request GET:/SiteDesignApi/Shop/RotatingBanners/{code}
		 */
		shopRotatingBannersDetail: (code: string, params: RequestParams = {}) =>
			this.request<RotatingBanner, any>({
				path: `/SiteDesignApi/Shop/RotatingBanners/${code}`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags SiteDesignApi
		 * @name ShopActivePopupsList
		 * @summary 화면에 나타냐야할 팝업 목록을 얻는다.
		 * @request GET:/SiteDesignApi/Shop/ActivePopups
		 */
		shopActivePopupsList: (params: RequestParams = {}) =>
			this.request<ShopPopup[], any>({
				path: `/SiteDesignApi/Shop/ActivePopups`,
				method: 'GET',
				format: 'json',
				...params
			})
	};
	storageApi = {
		/**
		 * No description
		 *
		 * @tags StorageApi
		 * @name UploadAttachedImageCreate
		 * @summary 첨부파일을 업로드한다.
		 * @request POST:/StorageApi/UploadAttachedImage
		 */
		uploadAttachedImageCreate: (
			data: {
				url?: string;
			},
			query?: {
				/** 업로드할 폴더명 */
				folder?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<UploadImageOutput, any>({
				path: `/StorageApi/UploadAttachedImage`,
				method: 'POST',
				query: query,
				body: data,
				type: ContentType.FormData,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags StorageApi
		 * @name PrepareUpload
		 * @summary Storage에 직접 업로드 하기위한 정보를 얻는다. 이 정보를 바탕으로 클라이언트는 스토리지에 직접 파일을 업로드해야 한다.
		 * @request POST:/StorageApi/PrepareUpload
		 */
		prepareUpload: (
			query?: {
				/** 업로드할 스토리지 폴더(게시판: board, 장바구니: cart) */
				folder?: string;
				/** 파일 확장자(.(period)포함) (ex: ".pdf") */
				ext?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<PrepareUploadOutput, any>({
				path: `/StorageApi/PrepareUpload`,
				method: 'POST',
				query: query,
				format: 'json',
				...params
			})
	};
	userManageApi = {
		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name GetFavoriteProductIdList
		 * @summary 현재 사용자가 즐겨찾기한 상품 ID 리스트를 얻는다.
		 * @request GET:/UserManageApi/Shop/FavoriteProductIds
		 */
		getFavoriteProductIdList: (params: RequestParams = {}) =>
			this.request<number[], any>({
				path: `/UserManageApi/Shop/FavoriteProductIds`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name ShopFavoritesList
		 * @summary 현재 사용자가 즐겨찾기한 상품 리스트를 얻는다.
		 * @request GET:/UserManageApi/Shop/Favorites
		 */
		shopFavoritesList: (
			query?: {
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<ShopProductDataList, any>({
				path: `/UserManageApi/Shop/Favorites`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name addFavorateProduct
		 * @summary 즐겨찾기를 추가한다.
		 * @request POST:/UserManageApi/Shop/Favorites
		 */
		addFavorateProduct: (data: ShopFavoriteProductInput, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/UserManageApi/Shop/Favorites`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name removeFavoriteProduct
		 * @summary 즐겨찾기를 삭제한다.
		 * @request DELETE:/UserManageApi/Shop/Favorites/{productId}
		 */
		removeFavoriteProduct: (productId: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/UserManageApi/Shop/Favorites/${productId}`,
				method: 'DELETE',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name ShopDeleteFavoritesCreate
		 * @summary 즐겨찾기를 삭제한다.(Multiple)
		 * @request POST:/UserManageApi/Shop/DeleteFavorites
		 */
		shopDeleteFavoritesCreate: (data: number[], params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/UserManageApi/Shop/DeleteFavorites`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name getCouponList
		 * @summary 현재 사용자의 쿠폰 목록을 얻는다.
		 * @request GET:/UserManageApi/Shop/Coupons
		 */
		getCouponList: (
			query?: {
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<CouponODataList, any>({
				path: `/UserManageApi/Shop/Coupons`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name ShopDeleteCouponsCreate
		 * @summary 나에게 발급된 쿠폰을 삭제한다.
		 * @request POST:/UserManageApi/Shop/DeleteCoupons
		 */
		shopDeleteCouponsCreate: (data: number[], params: RequestParams = {}) =>
			this.request<number[], ProblemDetails>({
				path: `/UserManageApi/Shop/DeleteCoupons`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name ShopRecentShippingAddressesList
		 * @summary 현재 사용자의 최근 배송지 목록을 얻는다.
		 * @request GET:/UserManageApi/Shop/RecentShippingAddresses
		 */
		shopRecentShippingAddressesList: (
			query?: {
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<ShippingAddressODataList, any>({
				path: `/UserManageApi/Shop/RecentShippingAddresses`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name getShippingAddressList
		 * @summary 현재 사용자의 배송지 목록을 얻는다.
		 * @request GET:/UserManageApi/Shop/ShippingAddresses
		 */
		getShippingAddressList: (
			query?: {
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<ShippingAddressODataList, any>({
				path: `/UserManageApi/Shop/ShippingAddresses`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name addShippingAddress
		 * @summary 배송지를 목록에 추가한다. 배송지는 배송 주소를 입혁할 때 사용할 수 있다.
		 * @request POST:/UserManageApi/Shop/ShippingAddresses
		 */
		addShippingAddress: (data: ShippingAddress, params: RequestParams = {}) =>
			this.request<ShippingAddress, any>({
				path: `/UserManageApi/Shop/ShippingAddresses`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name updateShippingAddress
		 * @summary 배송지 주소를 업데이트한다.
		 * @request PUT:/UserManageApi/Shop/ShippingAddresses/{id}
		 */
		updateShippingAddress: (id: number, data: ShippingAddress, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/UserManageApi/Shop/ShippingAddresses/${id}`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name deleteShippingAddress
		 * @summary 배송지를 목록에서 삭제한다.
		 * @request DELETE:/UserManageApi/Shop/ShippingAddresses/{id}
		 */
		deleteShippingAddress: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/UserManageApi/Shop/ShippingAddresses/${id}`,
				method: 'DELETE',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name setAsDefaultShippingAddress
		 * @summary 기본 배송지를 설정한다.
		 * @request POST:/UserManageApi/Shop/SetDefaultShippingAddress/{id}
		 */
		setAsDefaultShippingAddress: (id: number, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/UserManageApi/Shop/SetDefaultShippingAddress/${id}`,
				method: 'POST',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name ShopQuotationCartCreate
		 * @summary 장바구니 항목을 견적서 장바구니에 넣는다.
		 * @request POST:/UserManageApi/Shop/QuotationCart/{cartItemId}
		 */
		shopQuotationCartCreate: (cartItemId: number, params: RequestParams = {}) =>
			this.request<QuotationCartItem, any>({
				path: `/UserManageApi/Shop/QuotationCart/${cartItemId}`,
				method: 'POST',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name ShopQuotationCartList
		 * @summary 견적서 장바구니 내용을 얻는다.
		 * @request GET:/UserManageApi/Shop/QuotationCart
		 */
		shopQuotationCartList: (
			query?: {
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<QuotationCartItemODataList, any>({
				path: `/UserManageApi/Shop/QuotationCart`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name ShopDeleteQuotationCartItemsCreate
		 * @summary 견적서 장바구니 항목을 삭제한다.(Multiple)
		 * @request POST:/UserManageApi/Shop/DeleteQuotationCartItems
		 */
		shopDeleteQuotationCartItemsCreate: (data: number[], params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/UserManageApi/Shop/DeleteQuotationCartItems`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name ShopQuotationsCreate
		 * @summary 견적서 장바구니 항목 여러개 선택해 견적서에 넣는다.
		 * @request POST:/UserManageApi/Shop/Quotations
		 */
		shopQuotationsCreate: (data: AddQuotationInput, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/UserManageApi/Shop/Quotations`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name ShopQuotationsList
		 * @summary 견적서 리스트를 얻는다.
		 * @request GET:/UserManageApi/Shop/Quotations
		 */
		shopQuotationsList: (
			query?: {
				/** query의 조건을 의미함(ex1: [FieldName] eq 'keyword', ex2: startsWith([FieldName], 'keyword'), ex3: [ArrayField]/any(t: t/Name in ['keyword1', 'keyword2'])...) */
				$filter?: string;
				/** query 결과로 몇개의 item을 얻어올지를 지정(ex: 10) */
				$top?: string;
				/** query 결과를 얻을 때 몇개의 item을 skip하고 얻어올지를 지정(ex: 10) $top과 $skip으로 paging기능 구현 가능 */
				$skip?: string;
				/** query 결과를 얻을 때 sort 조건. 콤마로 분리된 여러 필드 지정가능. desc붙이면 역순 (ex1: [fieldName1], ex2: [FieldName1], [FieldName2] desc, ...) */
				$orderby?: string;
			},
			params: RequestParams = {}
		) =>
			this.request<QuotationODataList, any>({
				path: `/UserManageApi/Shop/Quotations`,
				method: 'GET',
				query: query,
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name ShopQuotationsDetail
		 * @summary 특정 견적서 상세 내용을 얻는다.
		 * @request GET:/UserManageApi/Shop/Quotations/{quotationId}
		 */
		shopQuotationsDetail: (quotationId: number, params: RequestParams = {}) =>
			this.request<Quotation, any>({
				path: `/UserManageApi/Shop/Quotations/${quotationId}`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags UserManageApi
		 * @name ShopDeleteQuotationsCreate
		 * @summary 견적서를 삭제한다.(Multiple)
		 * @request POST:/UserManageApi/Shop/DeleteQuotations
		 */
		shopDeleteQuotationsCreate: (data: number[], params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/UserManageApi/Shop/DeleteQuotations`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			})
	};

	// API 사용을 위한 Helper Function
	utils = {
		filterQueryBuilder: function (info: IFilterQueryInfo) {
			const queryList = [];
			let queryString;

			for (const query of info.queryList) {
				switch (query.condition) {
					case 'in':
						queryList.push(
							`${query.field}/any(t: t/Name in ${JSON.stringify(query.values)})`
						);
						break;
					case 'startWith':
						queryList.push(`startsWith(${query.field}, ${query.values[0]})`);
						break;
					case 'equal':
						queryList.push(`${query.field} eq ${query.values[0]}`);
						break;
					default:
						break;
				}
			}

			if (info.queryList.length > 1 && info.joinCondition) {
				queryString = queryList.join(` ${info.joinCondition} `);
			} else {
				queryString = queryList.join('');
			}
			return queryString;
		}
	};

	/**
	 * 싱글톤 인스턴스를 반환합니다.
	 * @param config API 설정 (처음 호출시에만 사용됩니다)
	 * @returns Api 인스턴스
	 */
	public static getInstance<T = unknown>(config?: ApiConfig<T>): Api<T> {
		if (!Api.instance) {
			if (!config) {
				throw new Error('Api 인스턴스가 초기화되지 않았습니다. 처음 호출시에는 config가 필요합니다.');
			}
			Api.instance = new Api(config);
			console.log('ShopicusAPI 싱글톤 인스턴스가 생성되었습니다.', Api.instance);
		}
		return Api.instance as Api<T>;
	}

	/**
	 * 기존 인스턴스를 제거하고 새로운 설정으로 인스턴스를 생성합니다.
	 * @param config 새로운 API 설정
	 * @returns 새로운 Api 인스턴스
	 */
	public static resetInstance<T = unknown>(config: ApiConfig<T>): Api<T> {
		Api.instance = null;
		return Api.getInstance(config);
	}
}

/**
 * ShopicusAPI 인스턴스를 초기화합니다.
 * @param config API 설정
 * @returns Api 인스턴스
 */
function initializeShopicusAPI(config: ApiConfig<unknown>): Api<unknown> {
	return Api.getInstance(config);
}

/**
 * 초기화된 ShopicusAPI 인스턴스를 반환합니다.
 * @returns Api 인스턴스
 * @throws {Error} 인스턴스가 초기화되지 않은 경우
 */
function getShopicusAPI(): Api<unknown> {
	return Api.getInstance();
}

/**
 * ShopicusAPI 인스턴스를 재설정합니다.
 * @param config 새로운 API 설정
 * @returns 새로운 Api 인스턴스
 */
function resetShopicusAPI(config: ApiConfig<unknown>): Api<unknown> {
	return Api.resetInstance(config);
}

export { initializeShopicusAPI, getShopicusAPI, resetShopicusAPI };
