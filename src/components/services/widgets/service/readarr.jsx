import useSWR from "swr";
import { useTranslation } from "react-i18next";

import Widget from "../widget";
import Block from "../block";

import { formatApiUrl } from "utils/api-helpers";

export default function Readarr({ service }) {
  const { t } = useTranslation();

  const config = service.widget;

  const { data: booksData, error: booksError } = useSWR(formatApiUrl(config, "book"));
  const { data: wantedData, error: wantedError } = useSWR(formatApiUrl(config, "wanted/missing"));
  const { data: queueData, error: queueError } = useSWR(formatApiUrl(config, "queue/status"));

  if (booksError || wantedError || queueError) {
    return <Widget error={t("widget.api_error")} />;
  }

  if (!booksData || !wantedData || !queueData) {
    return (
      <Widget>
        <Block label={t("readarr.wanted")} />
        <Block label={t("readarr.queued")} />
        <Block label={t("readarr.books")} />
      </Widget>
    );
  }

  const have = booksData.filter((book) => book.statistics.bookFileCount > 0);

  return (
    <Widget>
      <Block label={t("readarr.wanted")} value={wantedData.totalRecords} />
      <Block label={t("readarr.queued")} value={queueData.totalCount} />
      <Block label={t("readarr.books")} value={have.length} />
    </Widget>
  );
}
