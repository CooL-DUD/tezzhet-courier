<!-- @format -->

<template>
  <header class="header">
    <div @click="$router.go(-1)" class="header__icon">
      <icon-chevron />
    </div>
    <h2 class="header__title">{{ $t("reports") }}</h2>
  </header>
	<section class="container">
		<div v-if="reportsInfo?.completed_orders" class="page">
			<div class="block reports-total">
				<p class="reports-total__income">
					{{ reportsInfo.earned_money ? reportsInfo.earned_money : 0 }} ₸
				</p>
				<p
					@click="openCalendar = !openCalendar"
					class="reports-total__period label">
					{{
						new Date(filter.dateFrom).toLocaleDateString("ru", {
							month: "short",
							day: "numeric",
						})
					}}
					-
					{{
						new Date(filter.dateTo).toLocaleDateString("ru", {
							month: "short",
							day: "numeric",
						})
					}}
					<client-only>
						<div v-if="openCalendar" class="date-picker">
							<v-date-picker @click.stop v-model="datePicker" is-range />
						</div>
					</client-only>
				</p>
				<div class="reports-total__info">
					<div class="reports-total__info-item">
						<p v-if="$i18n.locale === 'ru'">
							{{ reportsInfo.taken_shifts }}
							{{
								reportsInfo.taken_shifts === 1
									? "смена"
									: reportsInfo.taken_shifts >= 2 &&
									  reportsInfo.taken_shifts <= 4
									? "смены"
									: "смен"
							}}
						</p>
						<p v-else>{{ reportsInfo.taken_shifts }} ауысым</p>
					</div>
					<div class="reports-total__info-item">
						<p v-if="$i18n.locale === 'ru'">
							{{ reportsInfo.completed_orders }}
							{{
								reportsInfo.completed_orders === 1
									? "заказ"
									: reportsInfo.completed_orders >= 2 &&
									  reportsInfo.completed_orders <= 4
									? "заказа"
									: "заказов"
							}}
						</p>
						<p v-else>{{ reportsInfo.completed_orders }} тапсырыс</p>
					</div>
					<div class="reports-total__info-item">
						<p>
							{{
								reportsInfo.shift_hours.includes(":")
									? timeFormatter(reportsInfo.shift_hours)
									: reportsInfo.shift_hours + $t("hours")
							}}
						</p>
					</div>
				</div>
				<!--        <div class="reports-total__item">-->
				<!--          <icon-coins/>-->
				<!--          <div class="reports-total__item-title">Чаевые</div>-->
				<!--          <div class="reports-total__item-value">80500 ₸</div>-->
				<!--        </div>-->
				<div class="reports-total__item">
					<!--          <icon-banknote/>-->
					<!--          <div class="reports-total__item-title">Оплата за смены</div>-->
					<!--          <div class="reports-total__item-value">63000 ₸</div>-->
				</div>
			</div>
			<div class="reports-list">
				<div class="report-list__container">
					<ProfileLinkItem
						v-for="item in reports"
						:to="`reports/${item?.date?.split('T')[0]}`">
						<icon-banknote-filled />
						<p class="reports-item__title">
							{{
								new Date(item?.date).toLocaleDateString("ru", {
									month: "short",
									day: "numeric",
								})
							}}
						</p>
						<p>{{ item?.earned_money }} ₸</p>
					</ProfileLinkItem>
				</div>
			</div>
		</div>
		<div v-else class="page">
			<h3 class="placeholder-text">{{ $t('reportsNotFound') }}</h3>
		</div>
	</section>
</template>
<script setup>
	import { useRouter } from "vue-router";
	import { useCookieLocale } from "#i18n";
	const { getReports, getReportsInfo } = useHttp();
	const router = useRouter();
	const reports = ref([]);
	const reportsInfo = ref(null);
	const date_today = new Date();
	const filter = ref({
		dateFrom: new Date(date_today.getFullYear(), date_today.getMonth(), 1),
		dateTo: new Date(date_today.getFullYear(), date_today.getMonth() + 1, 0),
	});
	const datePicker = ref(null);
	let openCalendar = ref(false);

	const lang = useCookieLocale();

	watch(
		datePicker,
		() => {
			filter.value.dateFrom = datePicker.value.start.toString();
			if (!datePicker.value) return;
			filter.value.dateTo = datePicker.value.end.toString();

			getReportsInfo({
				dateFrom: datePicker.value.start.toISOString().slice(0, 10),
				dateTo: datePicker.value.end.toISOString().slice(0, 10),
			}).then((res) => {
				reportsInfo.value = res;
			});
			getReports({
				dateFrom: datePicker.value.start.toISOString().slice(0, 10),
				dateTo: datePicker.value.end.toISOString().slice(0, 10),
			}).then((res) => {
				reports.value = res;
			});
		},
		{ deep: true }
	);

	if (useCookie("access_token").value || useCookie("refresh_token").value) {
		getReportsByDate();
	} else {
		router.push("/profile/login");
	}
	function getReportsByDate() {
		getReportsInfo({
			dateFrom: filter.value.dateFrom.toISOString().slice(0, 10),
			dateTo: filter.value.dateTo.toISOString().slice(0, 10),
		}).then((res) => {
			reportsInfo.value = res;
		});
		getReports({
			dateFrom: filter.value.dateFrom.toISOString().slice(0, 10),
			dateTo: filter.value.dateTo.toISOString().slice(0, 10),
		}).then((res) => {
			reports.value = res;
		});
	}

	function timeFormatter(time) {
		console.log(lang.value, "lang");
		const [h, m] = time.split(":").map(Number);
		return `${h + (lang.value === "kz" ? " сағ." : " ч.")} ${m} м`;
	}
</script>
<style lang="scss" scoped>
	.date-picker {
		position: absolute !important;
		top: 25px;
		left: 0;
		z-index: 100;
		width: 100%;
		height: 100%;
		background: transparent;
		border: none;
		outline: none;
		cursor: pointer;
	}
</style>
